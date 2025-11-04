import { ToastAndroid, Platform } from 'react-native';

class ToastService {
  show(message: string, duration: number = 2000) {
    if (Platform.OS === 'android') {
      // Para Android usamos ToastAndroid
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else if (Platform.OS === 'web') {
      // Para web creamos un toast custom
      this.showWebToast(message, duration);
    } else {
      // Para iOS y otros, usamos console.log
      console.log('TOAST:', message);
    }
  }

  private showWebToast(message: string, duration: number) {
    // Crear elemento de toast para web
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #667eea;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      z-index: 9999;
      font-family: system-ui, -apple-system, sans-serif;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 300px;
      word-wrap: break-word;
    `;

    document.body.appendChild(toast);

    // Remover después de la duración
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, duration);
  }

  success(message: string) {
    this.show(`✅ ${message}`);
  }

  error(message: string) {
    this.show(`❌ ${message}`);
  }

  info(message: string) {
    this.show(`ℹ️ ${message}`);
  }

  warning(message: string) {
    this.show(`⚠️ ${message}`);
  }
}

export default new ToastService();