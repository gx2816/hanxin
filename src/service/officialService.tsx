import c2s from "../utils/http";

const officailService = {
  //1.获取考试类目
  getCates(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/categories",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 2.一级类目添加或删除
  oneCates(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/category/one-level",
        method: "post",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 3.二级类目添加或删除
  twoCates(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/category/two-level",
        method: "post",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 查询考试资讯
  getExam(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/informations",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 4.添加或修改资讯信息 (用id判断)
  upExam(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/information/addition",
        method: "post",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 5. 删除资讯信息
  delExam(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/information/del",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 6. 添加或修改文章信息
  upArt(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/article/editor",
        method: "post",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 7. 删除文章信息
  delArt(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/article/del",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 8. 获取文章搜索标签
  getArtSpan(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/article/tags",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 9. 更新文章搜索标签
  upArtSpan(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/tags/addition",
        method: "post",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 10.文章查询
  getArts(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/articles",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  // 11.后台编辑获取文章内容
  getArtById(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/backend/content",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  },
  getArtCount(option: any) {
    return c2s(
      {
        url: "https://api.id-photo-verify.com/news/data/statistic",
        ...option
      },
      { autoApplyUrlPrefix: false }
    );
  }
};

export default officailService;
