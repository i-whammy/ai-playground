import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { CATEGORIES } from './categories';

// Base URL for the Rakuten Recipe Category Ranking API
const RAKUTEN_RECIPE_API_URL = 'https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426';
const APPLICATION_ID = `${process.env.RAKUTEN_RECIPE_APP_ID}`;

// Interface for the Rakuten Recipe API response
interface RakutenRecipeResponse {
  result: {
    small: string;
    medium: string;
    large: string;
  };
  recipes: {
    recipeId: number;
    recipeTitle: string;
    recipeUrl: string;
    foodImageUrl: string;
    recipeMaterial: string[];
    recipeCost: string;
    recipeIndication: string;
    recipeCatchcopy: string;
    recipeDescription: string;
    recipePublishday: string;
    rank: string;
  }[];
}

// Interface for category information
interface CategoryInfo {
  id: string;
  name: string;
  type: 'large' | 'medium' | 'small';
  parentId?: string;
}

// Helper function to get category name by ID
const getCategoryNameById = (categoryId: string): string | undefined => {
  // Check large categories
  const largeCategory = CATEGORIES.result.large.find(
    (category) => category.categoryId === categoryId
  );
  if (largeCategory) return largeCategory.categoryName;

  // Check medium categories
  const mediumCategory = CATEGORIES.result.medium.find(
    (category) => category.categoryId.toString() === categoryId
  );
  if (mediumCategory) return mediumCategory.categoryName;

  // Check small categories if they exist
  if (CATEGORIES.result.small) {
    const smallCategory = CATEGORIES.result.small.find(
      (category) => category.categoryId.toString() === categoryId
    );
    if (smallCategory) return smallCategory.categoryName;
  }

  return undefined;
};

// Helper function to get all categories
const getAllCategories = (): CategoryInfo[] => {
  const categories: CategoryInfo[] = [];

  // Add large categories
  const largeCategories = CATEGORIES.result.large.map((category) => ({
    id: category.categoryId,
    name: category.categoryName,
    type: 'large' as const,
  }));
  categories.push(...largeCategories);

  // Add medium categories
  const mediumCategories = CATEGORIES.result.medium.map((category) => ({
    id: category.categoryId.toString(),
    name: category.categoryName,
    type: 'medium' as const,
    parentId: category.parentCategoryId,
  }));
  categories.push(...mediumCategories);

  // Add small categories if they exist
  if (CATEGORIES.result.small) {
    const smallCategories = CATEGORIES.result.small.map((category) => ({
      id: category.categoryId.toString(),
      name: category.categoryName,
      type: 'small' as const,
      parentId: category.parentCategoryId,
    }));
    categories.push(...smallCategories);
  }

  return categories;
};

// Helper function to search categories by keyword
const searchCategoriesByKeyword = (keyword: string): CategoryInfo[] => {
  const allCategories = getAllCategories();
  return allCategories.filter(category => 
    category.name.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Function to search Rakuten recipes by category ID
const searchRakutenRecipesByCategory = async (categoryId: string) => {
  const url = `${RAKUTEN_RECIPE_API_URL}?applicationId=${APPLICATION_ID}&categoryId=${categoryId}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json() as RakutenRecipeResponse;
    
    // Get category name
    const categoryName = getCategoryNameById(categoryId) || 'Unknown Category';
    
    // Transform the response to match our output schema
    const recipes = data.recipes.map(recipe => ({
      title: recipe.recipeTitle,
      url: recipe.recipeUrl,
      imageUrl: recipe.foodImageUrl,
      ingredients: recipe.recipeMaterial,
      cost: recipe.recipeCost,
      cookingTime: recipe.recipeIndication,
      description: recipe.recipeDescription || recipe.recipeCatchcopy,
      rank: recipe.rank,
      categoryName,
      categoryId,
    }));
    
    return recipes;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Failed to fetch recipes for category ${categoryId}: ${error.message}`);
    } else {
      console.error(`Failed to fetch recipes for category ${categoryId}`);
    }
    return [];
  }
};

// Function to search recipes by keyword in category names
const searchRecipesByKeywordInCategories = async (keyword: string, maxCategories: number = 3) => {
  // Find categories matching the keyword
  const matchingCategories = searchCategoriesByKeyword(keyword);
  
  if (matchingCategories.length === 0) {
    return {
      keyword,
      matchingCategories: [],
      recipes: [],
    };
  }
  
  // Limit the number of categories to search to avoid too many API calls
  const categoriesToSearch = matchingCategories.slice(0, maxCategories);
  
  // Search for recipes in each matching category
  const recipesPromises = categoriesToSearch.map(category => 
    searchRakutenRecipesByCategory(category.id)
  );
  
  // Wait for all recipe searches to complete
  const recipeResults = await Promise.all(recipesPromises);
  
  // Flatten the array of recipe arrays
  const allRecipes = recipeResults.flat();
  
  return {
    keyword,
    matchingCategories: categoriesToSearch,
    recipes: allRecipes,
  };
};

// Create the Rakuten recipe search by category tool
export const rakutenRecipeCategoryTool = createTool({
  id: 'search-rakuten-recipes-by-category',
  description: 'Search for recipes in Rakuten Recipe by category ID',
  inputSchema: z.object({
    categoryId: z.string().describe('Category ID to search for recipes'),
  }),
  outputSchema: z.object({
    categoryName: z.string(),
    recipes: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        imageUrl: z.string(),
        ingredients: z.array(z.string()),
        cost: z.string(),
        cookingTime: z.string(),
        description: z.string(),
        rank: z.string(),
      })
    ),
  }),
  execute: async ({ context }) => {
    const recipes = await searchRakutenRecipesByCategory(context.categoryId);
    const categoryName = getCategoryNameById(context.categoryId) || 'Unknown Category';
    
    return {
      categoryName,
      recipes,
    };
  },
});

// Create the Rakuten recipe search by keyword tool
export const rakutenRecipeKeywordTool = createTool({
  id: 'search-rakuten-recipes-by-keyword',
  description: 'Search for recipes by finding categories that match a keyword',
  inputSchema: z.object({
    keyword: z.string().describe('Japanese word to search in category names'),
    maxCategories: z.number().optional().describe('Maximum number of categories to search (default: 3)'),
  }),
  outputSchema: z.object({
    keyword: z.string(),
    matchingCategories: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['large', 'medium', 'small']),
        parentId: z.string().optional(),
      })
    ),
    recipes: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        imageUrl: z.string(),
        ingredients: z.array(z.string()),
        cost: z.string(),
        cookingTime: z.string(),
        description: z.string(),
        rank: z.string(),
        categoryName: z.string(),
        categoryId: z.string(),
      })
    ),
  }),
  execute: async ({ context }) => {
    return await searchRecipesByKeywordInCategories(context.keyword, context.maxCategories);
  },
});

// Create the Rakuten recipe categories list tool
export const rakutenRecipeCategoriesListTool = createTool({
  id: 'list-rakuten-recipe-categories',
  description: 'List all available Rakuten Recipe categories',
  inputSchema: z.object({
    type: z.enum(['large', 'medium', 'small', 'all']).optional().describe('Type of categories to list (large, medium, small, or all)'),
    parentId: z.string().optional().describe('Parent category ID to filter medium/small categories'),
  }),
  outputSchema: z.object({
    categories: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['large', 'medium', 'small']),
        parentId: z.string().optional(),
      })
    ),
  }),
  execute: async ({ context }) => {
    const allCategories = getAllCategories();
    let filteredCategories: CategoryInfo[] = [];

    if (!context.type || context.type === 'all') {
      filteredCategories = allCategories;
      if (context.parentId) {
        filteredCategories = allCategories.filter(cat => 
          cat.type === 'large' || 
          (cat.parentId === context.parentId)
        );
      }
    } else {
      filteredCategories = allCategories.filter(cat => 
        cat.type === context.type && 
        (!context.parentId || cat.parentId === context.parentId)
      );
    }

    return { categories: filteredCategories };
  },
});
