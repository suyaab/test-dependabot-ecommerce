import { HomeBlogContent, HomeBlogContentSchema } from "../../types";
import { data as HomeBlogJSON } from "./content/home/blog.json";

// TODO: type all local returns if necessary
export default class LocalCMS {
  // Home Page Content
  public async getHomeBlogContent(): Promise<HomeBlogContent> {
    return await HomeBlogContentSchema.parseAsync(HomeBlogJSON);
  }
}
