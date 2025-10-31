
import { z } from 'zod';

export const Product = z.object({
  name: z.string(),
  cost: z.number().nonnegative().optional(),
  price: z.number().nonnegative().optional()
});

export const BusinessState = z.object({
  businessName: z.string().optional().default(''),
  category: z.string().min(1),
  location: z.string().optional().default(''),
  targetCustomer: z.string().min(1),

  
  businessType: z.enum(['product','service']).default('product'),
  detailLevel: z.enum(['short','long']).default('short'),

  language: z.enum(['English','Dari','Pashto']).default('English'),
  products: z.array(Product).min(0).default([]),  // may be empty for service
  constraints: z.string().optional().default(''),

  
  notes: z.string().optional().default('')
});

export const PlanoraPlan = z.object({
  slogans: z.array(z.string()),
  social_posts: z.array(z.object({
    caption: z.string(),
    media: z.string(),
    hashtags: z.array(z.string())
  })),
  one_week_plan: z.object({
    daily_actions: z.array(z.string()),
    quick_wins: z.array(z.string())
  }),
  customer_persona: z.object({
    name: z.string(),
    age_range: z.string(),
    needs: z.array(z.string()),
    where_to_find_them: z.array(z.string())
  }),
  product_copy: z.array(z.object({
    product: z.string(),
    description: z.string(),
    cta: z.string()
  })),
  price_hint: z.string(),
  content_calendar: z.array(z.object({
    title: z.string(),
    prompt: z.string()
  })),
  next_steps: z.array(z.string())
});
