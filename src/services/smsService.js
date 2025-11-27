import { Platform } from 'react-native';

// In a real production app with a development build, 
// we would use 'react-native-get-sms-android'
// import SmsAndroid from 'react-native-get-sms-android';

export const smsService = {
    // Simulate reading SMS
    readSMS: async () => {
        if (Platform.OS !== 'android') {
            console.log('SMS reading is only available on Android');
            return [];
        }

        // Mock implementation for Expo Go
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        _id: '1',
                        address: 'HDFC-Bank',
                        body: 'Rs 450 debited from a/c **1234 to STARBUCKS on 25-11-25. Avl Bal: 12000',
                        date: Date.now(),
                    },
                    {
                        _id: '2',
                        address: 'SBI-UPI',
                        body: 'Rs 1200 debited for NETFLIX via UPI. Ref 123456',
                        date: Date.now() - 86400000,
                    }
                ]);
            }, 1000);
        });
    },

    // Real implementation would look like this:
    /*
    readRealSMS: () => {
      return new Promise((resolve, reject) => {
        const filter = {
          box: 'inbox',
          maxCount: 20,
        };
  
        SmsAndroid.list(
          JSON.stringify(filter),
          (fail) => {
            console.log('Failed with this error: ' + fail);
            reject(fail);
          },
          (count, smsList) => {
            const arr = JSON.parse(smsList);
            resolve(arr);
          },
        );
      });
    }
    */
};
