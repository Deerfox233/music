import axios from 'axios';

export enum Base {
    IN = "http://localhost:5000",
    EX = "http://localhost:3000",
}

const instance = (base: Base) => {
    const inst = axios.create({
        baseURL: base,
        timeout: 5000,
    });

    // 请求拦截器
    inst.interceptors.request.use(config => {
        // 可以在这里对请求做一些处理，比如添加token等
        return config;
    }, error => {
        return Promise.reject(error);
    });

    // 响应拦截器
    inst.interceptors.response.use(response => {
        // 对响应数据做一些处理，比如将所有响应的数据放到data字段下
        return response.data;
    }, error => {
        return Promise.reject(error);
    });

    return inst;
};

export default instance;