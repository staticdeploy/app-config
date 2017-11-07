export interface IEnv {
    [key: string]: string | undefined;
}

export default function generateConfigScript(env: IEnv): string {
    const prefixRegexp = /^APP_CONFIG_/;
    const config = Object.keys(env)
        .filter(key => prefixRegexp.test(key))
        .reduce<IEnv>(
            (c, key) => ({
                ...c,
                [key.replace(prefixRegexp, "")]: env[key]
            }),
            {}
        );
    return `window.APP_CONFIG=${JSON.stringify(config)};`;
}
