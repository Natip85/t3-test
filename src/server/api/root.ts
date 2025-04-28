import {assetsRouter} from '@/features/assets/asset-router'
import {usersRouter} from '@/features/auth/user-router'
import {cartsRouter} from '@/features/cart/cart-router'
import {productsRouter} from '@/features/products/product-router'
import {createCallerFactory, createTRPCRouter} from '@/server/api/trpc'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: usersRouter,
  products: productsRouter,
  assets: assetsRouter,
  carts: cartsRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
