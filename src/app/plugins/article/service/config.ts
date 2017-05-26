import { OpaqueToken } from '@angular/core';

export interface IArticleConfig {
    webapi: IWebApiConfig;
}
interface IWebApiConfig {
    articleItems: string;
    warning: string,
    elegant: string,
    weather: string
}

export let Article_Config = new OpaqueToken("article.config");

export const dealConfig = (config: IArticleConfig): IArticleConfig => {
    return config;
}