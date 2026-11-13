import * as yamlModule from "js-yaml";

const yaml = yamlModule.default ?? yamlModule;

/**
 * Eleventy 配置
 * - 正文：src/index.md（Markdown）
 * - 数据：src/_data/*.yaml（个人信息、论文、项目、经历）
 * - 输出：_site/
 */
export default function (eleventyConfig) {
  // 让 Eleventy 认识 .yaml / .yml 数据文件
  eleventyConfig.addDataExtension("yaml,yml", (contents) => yaml.load(contents));

  // 静态资源原样拷贝
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // 作者里的"本人"加粗；corresponding 为真时在名字后加 *（模板里配合 | safe）
  eleventyConfig.addFilter("emph", (str, corresponding) => {
    if (!str) return "";
    const star = corresponding ? '<sup class="corr">*</sup>' : "";
    return String(str)
      .replace(/Qiuli\s*Wang/g, `<strong class="me">Qiuli Wang</strong>${star}`)
      .replace(/王秋里/g, `<strong class="me">王秋里</strong>${star}`);
  });


  // 站外链接加 target=_blank，mailto 不加
  eleventyConfig.addFilter("target", (url) =>
    String(url || "").startsWith("mailto:")
      ? ""
      : ' target="_blank" rel="noopener"'
  );

  // 论文按年份倒序
  eleventyConfig.addFilter("byYearDesc", (arr) =>
    [...(arr || [])].sort((a, b) => (b.year || 0) - (a.year || 0))
  );

  // 年份区间：2027 / 2027–2029
  eleventyConfig.addFilter("years", (item) => {
    if (!item) return "";
    if (!item.end || item.end === item.start) return String(item.start || "");
    return `${item.start}–${item.end}`;
  });

  // 构建时间戳，给 css / js 加 ?v= 防缓存
  eleventyConfig.addGlobalData("build", () => Date.now());

  eleventyConfig.addWatchTarget("./src/assets/");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/",
  };
}
