import {useState, useEffect} from 'react';
import {Linking} from 'react-native';

export const useVerificationLink = () => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const verificationUrl = await Linking.getInitialURL();
      //to prevent always being set in expo
      if(verificationUrl?.slice(3) != 'exp') { 
      setUrl(verificationUrl)
      }
    };

    getUrlAsync();
  }, []);

  return {url};
};