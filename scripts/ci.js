// https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html
const ci = require("miniprogram-ci");
const path = require("path");
const pkginfo = require('pkginfo')
const { program } = require('commander');

pkginfo(module)

const { version } = module.exports

program.option('--appid', "wechat miniprogram appid");
program.option('--version', "wechat miniprogram version");
program.option('--desc', "version description");
program.parse();
const options = program.opts()

const deploy = async () => {
  // 实例化项目
  const project = new ci.Project({
    appid: options.appid,
    type: "miniProgram",
    projectPath: path.resolve(__dirname, "../"),
    privateKeyPath: path.resolve(__dirname, "./privatekey.key"),
    // 支持 glob 语法
    ignores: ["node_modules/**/*"],
  });
  // 在有需要的时候构建npm
  const warning = await ci.packNpm(project, {
    ignores: ["pack_npm_ignore_list"],
    reporter: (infos) => {
      console.log(infos);
    },
  });
  console.warn(warning)
  // 上传代码
  const uploadResult = await ci.upload({
    project,
    // 版本号，优先用命令行版本号，其次用 package.json 的版本号
    version: options.version || version,
    // 版本描述
    desc: options.desc,
    // 配置信息
    setting: {
      es6: true,
    },
    onProgressUpdate: console.log,
  });
  console.log(uploadResult);
};

deploy();
