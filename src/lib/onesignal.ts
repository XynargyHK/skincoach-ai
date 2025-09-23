import OneSignal from 'react-onesignal';

export const initializeOneSignal = async () => {
  try {
    await OneSignal.init({
      appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
      safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID,
      allowLocalhostAsSecureOrigin: true,
    });

    console.log('OneSignal initialized successfully');
  } catch (error) {
    console.error('OneSignal initialization failed:', error);
  }
};

export const sendNotification = async (message: string, heading?: string) => {
  try {
    // OneSignal notifications are typically triggered from the server side
    // This is a placeholder for future server-side implementation
    console.log('Notification would be sent:', { message, heading });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

export const subscribeUser = async () => {
  try {
    await OneSignal.Slidedown.promptPush();
  } catch (error) {
    console.error('Failed to subscribe user:', error);
  }
};