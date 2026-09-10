// =====================================================
// DLTJ2.1
// FILE: src/setting/notificationService.ts
// NOTIFICATION SERVICE
// =====================================================

export type NotificationType =
  | "success"
  | "error"
  | "warning"
  | "info";

export interface NotificationPayload {
  title: string;
  message: string;
  type?: NotificationType;
  sound?: boolean;
}

class NotificationService {
  private audioContext: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") {
      return null;
    }

    if (!this.audioContext) {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }).webkitAudioContext;

      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    }

    return this.audioContext;
  }

  playSound(): void {
    const context = this.getAudioContext();

    if (!context) {
      return;
    }

    if (context.state === "suspended") {
      context.resume().catch(() => undefined);
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(700, context.currentTime);

    gainNode.gain.setValueAtTime(0.08, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + 0.15
    );

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.15);
  }

  show(payload: NotificationPayload): void {
    if (payload.sound) {
      this.playSound();
    }

    if (
      typeof window !== "undefined" &&
      "Notification" in window
    ) {
      if (Notification.permission === "granted") {
        new Notification(payload.title, {
          body: payload.message,
        });
      }
    }
  }

  async requestPermission(): Promise<NotificationPermission | null> {
    if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      return null;
    }

    if (Notification.permission === "default") {
      return Notification.requestPermission();
    }

    return Notification.permission;
  }
}

export const notificationService = new NotificationService();

export default notificationService;