import isPublicRoute from "./constants";


axios.interceptors.request.use(function(config){
    const token = localStorage.getItem("token");

    if (token && !isPublicRoute) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  }, function (error) {
    return Promise.reject(error);
  });






