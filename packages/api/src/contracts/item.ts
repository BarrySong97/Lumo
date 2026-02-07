import { type ContractProcedure, type Meta, oc, type Schema } from "@orpc/contract"
import { type CommonErrorMap, commonErrors } from "../errors/common"
import {
  ItemSchema,
  CreateItemInputSchema,
  UpdateItemInputSchema,
  GetItemInputSchema,
  DeleteItemInputSchema,
  ItemListOutputSchema,
  DeleteItemOutputSchema,
} from "../schemas/item"
import { healthCheckOutputSchema } from "../schemas/health-check"
import { ChatStreamInputSchema, ChatStreamOutputSchema } from "../schemas/chat"

type NoInput = Schema<unknown, unknown>
type DefaultMeta = Meta

export type ItemContract = {
  healthCheck: ContractProcedure<
    NoInput,
    typeof healthCheckOutputSchema,
    CommonErrorMap,
    DefaultMeta
  >
  item: {
    list: ContractProcedure<
      NoInput,
      typeof ItemListOutputSchema,
      CommonErrorMap,
      DefaultMeta
    >
    get: ContractProcedure<
      typeof GetItemInputSchema,
      typeof ItemSchema,
      CommonErrorMap,
      DefaultMeta
    >
    create: ContractProcedure<
      typeof CreateItemInputSchema,
      typeof ItemSchema,
      CommonErrorMap,
      DefaultMeta
    >
    update: ContractProcedure<
      typeof UpdateItemInputSchema,
      typeof ItemSchema,
      CommonErrorMap,
      DefaultMeta
    >
    delete: ContractProcedure<
      typeof DeleteItemInputSchema,
      typeof DeleteItemOutputSchema,
      CommonErrorMap,
      DefaultMeta
    >
  }
  chat: {
    stream: ContractProcedure<
      typeof ChatStreamInputSchema,
      typeof ChatStreamOutputSchema,
      CommonErrorMap,
      DefaultMeta
    >
  }
}

export const itemContract: ItemContract = {
  healthCheck: oc
    .route({ method: "GET" })
    .output(healthCheckOutputSchema)
    .errors(commonErrors),
  item: {
    list: oc
      .route({ method: "GET" })
      .output(ItemListOutputSchema)
      .errors(commonErrors),
    get: oc
      .input(GetItemInputSchema)
      .output(ItemSchema)
      .errors(commonErrors),
    create: oc
      .input(CreateItemInputSchema)
      .output(ItemSchema)
      .errors(commonErrors),
    update: oc
      .input(UpdateItemInputSchema)
      .output(ItemSchema)
      .errors(commonErrors),
    delete: oc
      .route({ method: "DELETE" })
      .input(DeleteItemInputSchema)
      .output(DeleteItemOutputSchema)
      .errors(commonErrors),
  },
  chat: {
    stream: oc
      .route({ method: "POST" })
      .input(ChatStreamInputSchema)
      .output(ChatStreamOutputSchema)
      .errors(commonErrors),
  },
}
