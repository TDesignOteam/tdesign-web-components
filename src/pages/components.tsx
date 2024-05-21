import './components/md-docs.tsx';
import './components/docs-sidebar.tsx';
import { Component, tag, bind, classNames } from 'omi';
import * as MarkdownIt from 'markdown-it';
// import { docsConfig } from '../docs/config';
import { sidebarItems, activeSidebarItem, isSidebarOpen } from '../store.ts';

// @ts-ignore
const MdIt = MarkdownIt.default ? MarkdownIt.default : MarkdownIt;

type NavTreeNode = {
  title: string;
  children: NavTreeNode[];
};

type Props = {
  component: string;
  markdownContent: string;
};

@tag('product-docs')
export class ProductDocs extends Component<Props> {
  state: {
    markdownContent: string;
    navTree: NavTreeNode;
    active: [string, string];
  } = {
    markdownContent: '',
    navTree: { title: '', children: [] },
    active: ['', ''],
  };

  @bind
  async onChange(evt: CustomEvent) {
    // 滚动到最顶
    window.scrollTo(0, 0);
    history.pushState(null, '', evt.detail.item.path);
    const { default: markdownContent } = await import(`../components/${evt.detail.item.value}/README.md?raw`);
    this.state.markdownContent = markdownContent;
    this.update();
  }

  md: MarkdownIt = new MdIt();

  install() {
    this.state.markdownContent = this.props.markdownContent;

    activeSidebarItem.value = this.props.component;

    this.setNavTree();
  }

  // 提取 markdown 中的标题
  setNavTree() {
    const tokens = this.md.parse(this.state.markdownContent, {});

    let currentNode: NavTreeNode = this.state.navTree;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'heading_open') {
        const title = tokens[i + 1].content;
        const newNode: NavTreeNode = { title, children: [] };

        if (token.tag === 'h2') {
          this.state.navTree.children.push(newNode);
          currentNode = newNode;
        } else if (token.tag === 'h3') {
          currentNode.children.push(newNode);
        }
      }
    }
    this.state.active = [this.state.navTree.children[0].title, this.state.navTree.children[0].children?.[0]?.title];
  }

  goToSection = (item: NavTreeNode) => () => {
    this.state.active = [item.title, ''];
    this.update();
    this.scrollToH2(item.title);
  };

  goToSubSection = (item: NavTreeNode, child: NavTreeNode) => () => {
    this.state.active = [item.title, child.title];
    this.update();
    this.scrollToH3(child.title);
  };

  scrollToH2(title: string) {
    const h2Elements = (
      this.rootElement?.querySelector('md-docs') as HTMLElement & {
        rootElement: HTMLElement;
      }
    )?.rootElement.getElementsByTagName('h2');
    for (let i = 0; i < h2Elements.length; i++) {
      if (h2Elements[i].textContent === title) {
        h2Elements[i].scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }

  scrollToH3(title: string) {
    const h2Elements = (
      this.rootElement?.querySelector('md-docs') as HTMLElement & {
        rootElement: HTMLElement;
      }
    ).rootElement.getElementsByTagName('h3');
    for (let i = 0; i < h2Elements.length; i++) {
      if (h2Elements[i].textContent === title) {
        h2Elements[i].scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }

  render() {
    return (
      <div class="flex min-h-full bg-white dark:bg-zinc-800">
        <div class="flex w-full flex-col">
          <div class="relative mx-auto flex w-full max-w-8xl flex-auto justify-center sm:pr-2 lg:pr-8 xl:pr-12">
            <div class="fixed top-[58px] left-0 overflow-y-auto">
              <o-sidebar
                onChange={(evt: CustomEvent) => (activeSidebarItem.value = evt.detail.item.value)}
                items={sidebarItems.value}
                active={activeSidebarItem.value}
                isOpen={isSidebarOpen.value}
                onInstalled={window.refreshDark}
              ></o-sidebar>
            </div>
            <div class="min-w-0 max-w-2xl flex-auto px-4 py-16 ml-[240px] lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
              <article>
                <md-docs content={this.state.markdownContent}></md-docs>
              </article>
            </div>
            <div class="hidden xl:sticky xl:top-[4.75rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.75rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
              <nav aria-labelledby="on-this-page-title" class="w-56">
                <h2 id="on-this-page-title" class="font-display text-sm font-medium text-slate-900 dark:text-white">
                  On this page
                </h2>
                <ol role="list" class="mt-4 space-y-3 text-sm">
                  {this.state.navTree.children.map((item: NavTreeNode) => (
                    <li class="text-slate-500 dark:text-slate-400">
                      <h3 onClick={this.goToSection(item)}>
                        <a
                          class={classNames({
                            'text-primary brightness-125': this.state.active[0] === item.title,
                            'hover:text-slate-600 dark:hover:text-slate-300': this.state.active[0] !== item.title,
                          })}
                          href="javascript:void(0)"
                        >
                          {item.title}
                        </a>
                      </h3>
                      <ol role="list" class="mt-2 space-y-3 pl-5">
                        {item.children.map((child: NavTreeNode) => (
                          <li onClick={this.goToSubSection(item, child)}>
                            <a
                              class={classNames({
                                'text-primary brightness-125': this.state.active[1] === child.title,
                                'hover:text-slate-600 dark:hover:text-slate-300': this.state.active[1] !== child.title,
                              })}
                              href="javascript:void(0)"
                            >
                              {child.title}
                            </a>
                          </li>
                        ))}
                      </ol>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
