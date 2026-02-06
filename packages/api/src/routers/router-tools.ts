import { implement, os } from "@orpc/server"

import type { Context } from "../context"
import { itemContract } from "../contracts/item"
import { commonErrors } from "../errors/common"

const base = os.$context<Context>().errors(commonErrors)

export const i = implement(itemContract).$context<Context>()

export { base }
