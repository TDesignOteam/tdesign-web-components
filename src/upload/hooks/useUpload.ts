import { SignalValue, computed, createRef, signal } from 'omi';

import {
  formatToUploadFile,
  getDisplayFiles,
  getFilesAndErrors,
  getTriggerTextField,
  upload,
  validateFile,
} from '../../_common/js/upload/main';
import { OnResponseErrorContext, SizeLimitObj } from '../../_common/js/upload/types';
import { getFileList } from '../../_common/js/upload/utils';
import { classPrefix } from '../../_util/classname';
import zhCn from '../../locale/zh_CN';
import { TdUploadProps, UploadChangeContext, UploadFile, UploadRemoveContext } from '../type';
import { t, toRef } from '../utils';

export type ValidateParams = Parameters<TdUploadProps['onValidate']>[0];

export default function useUpload(props: SignalValue<TdUploadProps>) {
  const inputRef = createRef<HTMLInputElement>();
  const {
    disabled,
    autoUpload,
    files,
    onChange,
    onSelectChange,
    sizeLimit,
    beforeUpload,
    onValidate,
    action,
    formatResponse,
    onSuccess,
    onFail,
  } = toRef(props);
  if (!files.value) {
    files.value = [];
  }
  const [uploadValue, setUploadValue] = [
    files,
    (value: typeof files.value, context: UploadChangeContext) => {
      files.value = value;
      onChange.value?.(value, context);
    },
  ];
  const xhrReq = signal<{ files: UploadFile[]; xhrReq: XMLHttpRequest }[]>([]);
  const toUploadFiles = signal<UploadFile[]>([]);
  const sizeOverLimitMessage = signal('');

  const locale = computed(() => zhCn.upload);

  const tipsClasses = `${classPrefix}-upload__tips ${classPrefix}-size-s`;
  const errorClasses = [tipsClasses].concat(`${classPrefix}-upload__tips-error`);
  const placeholderClass = `${classPrefix}-upload__placeholder`;

  // 单文件场景：触发元素文本
  const triggerUploadText = computed(() => {
    const field = getTriggerTextField({
      isBatchUpload: false,
      multiple: false,
      status: uploadValue.value?.[0]?.status,
      autoUpload: autoUpload.value,
    });
    return locale.value.triggerUploadText[field];
  });

  const uploading = signal(false);

  // 文件列表显示的内容（自动上传和非自动上传有所不同）
  const displayFiles = computed(() =>
    getDisplayFiles({
      multiple: false,
      toUploadFiles: toUploadFiles.value,
      uploadValue: uploadValue.value,
      autoUpload: autoUpload.value,
      isBatchUpload: false,
    }),
  );

  const uploadFilePercent = (params: { file: UploadFile; percent: number }) => {
    const { file, percent } = params;
    const operationUploadFiles = autoUpload.value ? toUploadFiles : uploadValue;
    const index = operationUploadFiles.value.findIndex((item) => file.raw === item.raw);
    operationUploadFiles.value[index] = { ...operationUploadFiles.value[index], percent };
  };

  const updateFilesProgress = () => {
    if (autoUpload.value) {
      toUploadFiles.value = [...toUploadFiles.value];
    }
  };

  const onResponseError = (p: OnResponseErrorContext) => {
    if (!p || !p.files || !p.files[0]) return;
    // const { response, event, files } = p;
    updateFilesProgress();
    setUploadValue([], {
      trigger: 'progress-fail',
      e: p.event,
      file: p.files[0],
    });
    // }
  };
  const handleNotAutoUpload = async (toFiles: UploadFile[]) => {
    if (!toFiles.length) return;
    const tmpFiles = await Promise.all(
      toFiles.map(async (file) => {
        if (file.url || !file.raw.type.startsWith('image')) {
          return file;
        }
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              ...file,
              url: (e.target as FileReader).result as string,
            });
          };
          reader.readAsDataURL(file.raw);
        });
      }),
    );
    console.log(tmpFiles);

    setUploadValue(tmpFiles, {
      trigger: 'add',
      index: uploadValue.value.length,
      file: toFiles[0],
      files: toFiles,
    });
    toUploadFiles.value = [];
  };
  // 多文件上传场景，单个文件进度
  const onResponseProgress = () => {
    updateFilesProgress();
  };

  function getSizeLimitError(sizeLimitObj: SizeLimitObj) {
    const limit = sizeLimitObj;
    return limit.message
      ? t(limit.message, { sizeLimit: limit.size })
      : `${t(locale.value.sizeLimitMessage, { sizeLimit: limit.size })} ${limit.unit}`;
  }

  const onFileChange = (files: File[]) => {
    if (disabled.value) return;
    const params = { currentSelectedFiles: formatToUploadFile([...files], undefined) };
    onSelectChange.value?.([...files], params);
    validateFile({
      uploadValue: uploadValue.value,
      // @ts-ignore
      files: [...files],
      max: 0,
      sizeLimit: sizeLimit.value,
      autoUpload: autoUpload.value,
      beforeUpload: beforeUpload.value,
    }).then((args) => {
      // 自定义全文件校验不通过
      if (args.validateResult?.type === 'BEFORE_ALL_FILES_UPLOAD') {
        const params: ValidateParams = { type: 'BEFORE_ALL_FILES_UPLOAD', files: args.files };
        onValidate.value?.(params);
        return;
      }
      // 文件数量校验不通过
      if (args.lengthOverLimit) {
        const params: ValidateParams = { type: 'FILES_OVER_LENGTH_LIMIT', files: args.files };
        onValidate.value?.(params);
        if (!args.files.length) return;
      }
      // 过滤相同的文件名
      if (args.hasSameNameFile) {
        const params: ValidateParams = { type: 'FILTER_FILE_SAME_NAME', files: args.files };
        onValidate.value?.(params);
      }
      // 文件大小校验结果处理（已过滤超出限制的文件）
      if (args.fileValidateList instanceof Array) {
        const { sizeLimitErrors, beforeUploadErrorFiles, toFiles } = getFilesAndErrors(
          args.fileValidateList,
          getSizeLimitError,
        );
        const tmpWaitingFiles = autoUpload.value ? toFiles : toUploadFiles.value.concat(toFiles);
        toUploadFiles.value = tmpWaitingFiles;
        // 文件大小处理
        if (sizeLimitErrors[0]) {
          sizeOverLimitMessage.value = sizeLimitErrors[0].file.response.error;
          onValidate.value?.({ type: 'FILE_OVER_SIZE_LIMIT', files: sizeLimitErrors.map((t) => t.file) });
        } else {
          sizeOverLimitMessage.value = '';
          // 自定义方法 beforeUpload 拦截的文件
          if (beforeUploadErrorFiles.length) {
            const params: ValidateParams = { type: 'CUSTOM_BEFORE_UPLOAD', files: beforeUploadErrorFiles };
            onValidate.value?.(params);
          }
        }
        // 如果是自动上传
        if (autoUpload.value) {
          uploadFiles(tmpWaitingFiles);
        } else {
          handleNotAutoUpload(tmpWaitingFiles);
        }
      }
    });

    // 清空 <input type="file"> 元素的文件，避免出现重复文件无法选择的情况
    inputRef.current.value = null;
  };

  const onNormalFileChange = (e: InputEvent) => {
    const fileList = getFileList((e.target as HTMLInputElement).files);
    onFileChange?.(fileList);
  };

  function onDragFileChange(files: File[]) {
    onFileChange?.(files);
  }

  function onPasteFileChange(e: ClipboardEvent) {
    onFileChange?.([...e.clipboardData.files]);
  }

  /**
   * 上传文件。对外暴露方法，修改时需谨慎
   * @param toFiles 本地上传的文件列表
   */
  function uploadFiles(toFiles?: UploadFile[]) {
    const notUploadedFiles = uploadValue.value.filter((t) => t.status !== 'success');
    const files = autoUpload.value ? toFiles || toUploadFiles.value : notUploadedFiles;
    if (!files || !files.length) return;
    uploading.value = true;
    xhrReq.value = [];
    upload({
      action: action.value,
      // headers: props.headers,
      // method: props.method,
      // name: props.name,
      // withCredentials: props.withCredentials,
      uploadedFiles: uploadValue.value,
      toUploadFiles: files,
      // multiple: props.multiple,
      // isBatchUpload: isBatchUpload.value,
      autoUpload: autoUpload.value,
      // uploadAllFilesInOneRequest: props.uploadAllFilesInOneRequest,
      // useMockProgress: props.useMockProgress,
      // data: props.data,
      // mockProgressDuration: props.mockProgressDuration,
      // requestMethod: props.requestMethod,
      // formatRequest: props.formatRequest,
      formatResponse: formatResponse.value,
      onResponseProgress,
      // onResponseSuccess,
      onResponseError,
      setXhrObject: (xhr) => {
        if (xhr.files[0]?.raw && xhrReq.value.find((item) => item.files[0]?.raw === xhr.files[0].raw)) return;
        xhrReq.value = xhrReq.value.concat(xhr);
      },
    }).then(
      // 多文件场景时，全量文件完成后
      ({ status, data, list, failedFiles }) => {
        uploading.value = false;
        if (status === 'success') {
          setUploadValue([...data.files], {
            trigger: 'add',
            file: data.files[0],
          });
          xhrReq.value = [];
          onSuccess.value?.({
            fileList: data.files,
            currentFiles: files,
            file: files[0],
            // 只有全部请求完成后，才会存在该字段
            results: list?.map((t) => t.data),
            // 单文件单请求有一个 response，多文件多请求有多个 response
            response: data.response || list.map((t) => t.data.response),
            XMLHttpRequest: data.XMLHttpRequest,
          });
        } else if (failedFiles?.[0]) {
          onFail.value?.({
            e: data.event,
            file: failedFiles[0],
            failedFiles,
            currentFiles: files,
            response: data.response,
            XMLHttpRequest: data.XMLHttpRequest,
          });
        }

        // 非自动上传，文件都在 uploadValue，不涉及 toUploadFiles
        if (autoUpload.value) {
          toUploadFiles.value = failedFiles;
          // props.onWaitingUploadFilesChange?.({ files: failedFiles, trigger: 'uploaded' });
        }
      },
    );
  }

  function onRemove(p: UploadRemoveContext) {
    sizeOverLimitMessage.value = '';
    p.e.stopPropagation?.();
    const changePrams: UploadChangeContext = {
      e: p.e,
      trigger: 'remove',
      index: p.index,
      file: p.file,
    };
    setUploadValue([], changePrams);
    toUploadFiles.value = [];
    xhrReq.value = [];
    // props.onRemove?.(p);
  }

  const triggerUpload = (e?: MouseEvent) => {
    if (disabled.value || !inputRef.current) return;
    e?.stopPropagation?.();
    inputRef.current.click();
  };

  const cancelUpload = (context?: { file?: UploadFile; e?: MouseEvent }) => {
    xhrReq.value?.forEach((item) => {
      item.xhrReq?.abort();
    });
    uploading.value = false;

    // autoUpload do not need to reset to waiting state
    if (autoUpload.value) {
      toUploadFiles.value = [];
    } else {
      setUploadValue(
        uploadValue.value.map((item) => {
          if (item.status !== 'success') {
            return { ...item, status: 'waiting' };
          }
          return item;
        }),
        { trigger: 'abort' },
      );
    }

    if (context?.file && !autoUpload.value) {
      onRemove?.({ file: context.file, e: context.e, index: 0 });
    }

    // props.onCancelUpload?.();
  };

  return {
    t,
    locale,
    classPrefix,
    triggerUploadText,
    toUploadFiles,
    uploadValue,
    displayFiles,
    sizeOverLimitMessage,
    uploading,
    tipsClasses,
    errorClasses,
    placeholderClass,
    inputRef,
    disabled,
    xhrReq,
    uploadFilePercent,
    uploadFiles,
    onFileChange,
    onNormalFileChange,
    onDragFileChange,
    onPasteFileChange,
    onRemove,
    triggerUpload,
    cancelUpload,
  };
}
