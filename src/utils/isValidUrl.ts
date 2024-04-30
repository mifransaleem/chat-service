const isValidURL = (url) => {
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;  
    return urlPattern.test(url);
  };
  
  export default isValidURL;