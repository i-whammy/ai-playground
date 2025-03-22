import { Agent } from "@mastra/core";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { rakutenRecipeCategoriesListTool, rakutenRecipeCategoryTool, rakutenRecipeKeywordTool } from "../tools";

export const rakutenRecipe = new Agent({
  name: 'Rakuten Recipe Agent',
  instructions: `
    あなたはユーザーから食材や料理名を受け取り、楽天レシピからレシピを検索するエージェントです。
    - ユーザーから食材の名前（例として、にんじん、牛肉など）を受け取って、おすすめのレシピを3つ返します。
    - 食材が入力されていない場合は、ユーザーに食材を尋ねてください。
    - レシピのタイトル、画像、材料、調理時間、説明、評価を返してください。
  `,
  model: openrouter('openai/gpt-4o'),
  tools: { rakutenRecipeKeywordTool, rakutenRecipeCategoriesListTool, rakutenRecipeCategoryTool },
})