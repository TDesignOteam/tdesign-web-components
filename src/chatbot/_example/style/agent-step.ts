export const styles = `
.travel-step {
  margin: 8px 0;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.step-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.step-status {
  font-size: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-content {
  flex: 1;
}

.step-name {
  font-weight: 600;
  font-size: 14px;
}

.step-time {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 2px;
}

.travel-plan {
  margin: 8px 0;
  padding: 16px;
  border-radius: 8px;
   border: 1px solid #e0e0e0;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plan-header h4 {
  margin: 0;
  font-size: 16px;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
   border: 1px solid #e0e0e0;
}

.status.planning {
  background: rgba(255, 255, 255, 0.2);
}

.status.completed {
  background: rgba(76, 175, 80, 0.8);
}

.status.failed {
  background: rgba(244, 67, 54, 0.8);
}

.plan-content {
  margin-bottom: 12px;
}

.plan-content p {
  margin: 0;
  line-height: 1.5;
}

.destinations {
  margin-bottom: 8px;
  font-size: 14px;
}

.plan-details {
  display: flex;
  gap: 16px;
  font-size: 12px;
  opacity: 0.9;
}

.travel-action {
  margin: 8px 0;
  padding: 12px;
  border-radius: 8px;
   border: 1px solid #e0e0e0;
}

.action-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.action-status {
  font-size: 18px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
}

.action-info {
  flex: 1;
}

.action-step {
  font-weight: 600;
  font-size: 13px;
}

.action-name {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 2px;
}

.action-details {
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.4;
}

.travel-state {
  margin: 8px 0;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  color: #333;
}

.state-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.state-header h5 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.progress-bar {
  position: relative;
  width: 80px;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #8bc34a);
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.current-step {
  margin-bottom: 8px;
  font-size: 13px;
}

.context-info {
  font-size: 12px;
}

.context-info pre {
  margin: 4px 0 0 0;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  font-size: 11px;
  overflow-x: auto;
} `;
