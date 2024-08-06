/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment OrderLineItem on LineItem {\n    title\n    variantTitle\n    quantity\n    discountAllocations {\n      allocatedAmountSet {\n        presentmentMoney {\n          amount\n          currencyCode\n        }\n      }\n    }\n    discountedTotalSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    image {\n      url\n      altText\n    }\n    product {\n      handle\n    }\n    variant {\n      legacyResourceId\n    }\n  }\n": types.OrderLineItemFragmentDoc,
    "\n  fragment OrderItem on Order {\n    id\n    name\n    legacyResourceId\n    createdAt\n    processedAt\n    updatedAt\n    cancelReason\n    cancelledAt\n    displayFulfillmentStatus\n    returnStatus\n    displayFinancialStatus\n    email\n    phone\n    lineItems(first: 250) {\n      nodes {\n        ...OrderLineItem\n      }\n    }\n    shippingAddress {\n      formatted\n      name\n    }\n    fulfillments {\n      trackingInfo {\n        company\n        number\n        url\n      }\n    }\n    currentSubtotalPriceSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    currentTotalTaxSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    totalShippingPriceSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    shippingLine {\n      discountAllocations {\n        allocatedAmountSet {\n          presentmentMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    currentTotalPriceSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    totalRefundedSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n  }\n": types.OrderItemFragmentDoc,
    "\n  mutation CustomerDelete($input: CustomerDeleteInput!) {\n    customerDelete(input: $input) {\n      deletedCustomerId\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": types.CustomerDeleteDocument,
    "\n  mutation CustomerCreate($input: CustomerInput!) {\n    customerCreate(input: $input) {\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": types.CustomerCreateDocument,
    "\n  mutation CustomerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {\n    customerEmailMarketingConsentUpdate(input: $input) {\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": types.CustomerEmailMarketingConsentUpdateDocument,
    "\n  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {\n    metafieldsSet(metafields: $metafields) {\n      metafields {\n        value\n        key\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": types.MetafieldsSetDocument,
    "\n  mutation RequestReturnMutation($input: ReturnRequestInput!) {\n    returnRequest(input: $input) {\n      return {\n        id\n        status\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n": types.RequestReturnMutationDocument,
    "\n  query GetCustomerByEmail($email: String!) {\n    customers(first: 1, query: $email) {\n      nodes {\n        id\n        email\n        numberOfOrders\n        emailMarketingConsent {\n          marketingState\n          marketingOptInLevel\n        }\n      }\n    }\n  }\n": types.GetCustomerByEmailDocument,
    "\n  query GetReturnableFulfillments($orderId: ID!) {\n    returnableFulfillments(orderId: $orderId, first: 150) {\n      nodes {\n        returnableFulfillmentLineItems(first: 150) {\n          nodes {\n            quantity\n            fulfillmentLineItem {\n              id\n              originalTotalSet {\n                presentmentMoney {\n                  amount\n                  currencyCode\n                }\n              }\n              lineItem {\n                variantTitle\n                title\n                image {\n                  url\n                  altText\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n": types.GetReturnableFulfillmentsDocument,
    "\n  query GetCustomerOrders(\n    $first: Int = 250\n    $after: String\n    $query: String\n    $sortKey: OrderSortKeys\n    $reverse: Boolean\n  ) {\n    orders(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      nodes {\n        ...OrderItem\n      }\n    }\n  }\n": types.GetCustomerOrdersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrderLineItem on LineItem {\n    title\n    variantTitle\n    quantity\n    discountAllocations {\n      allocatedAmountSet {\n        presentmentMoney {\n          amount\n          currencyCode\n        }\n      }\n    }\n    discountedTotalSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    image {\n      url\n      altText\n    }\n    product {\n      handle\n    }\n    variant {\n      legacyResourceId\n    }\n  }\n"): (typeof documents)["\n  fragment OrderLineItem on LineItem {\n    title\n    variantTitle\n    quantity\n    discountAllocations {\n      allocatedAmountSet {\n        presentmentMoney {\n          amount\n          currencyCode\n        }\n      }\n    }\n    discountedTotalSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    image {\n      url\n      altText\n    }\n    product {\n      handle\n    }\n    variant {\n      legacyResourceId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment OrderItem on Order {\n    id\n    name\n    legacyResourceId\n    createdAt\n    processedAt\n    updatedAt\n    cancelReason\n    cancelledAt\n    displayFulfillmentStatus\n    returnStatus\n    displayFinancialStatus\n    email\n    phone\n    lineItems(first: 250) {\n      nodes {\n        ...OrderLineItem\n      }\n    }\n    shippingAddress {\n      formatted\n      name\n    }\n    fulfillments {\n      trackingInfo {\n        company\n        number\n        url\n      }\n    }\n    currentSubtotalPriceSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    currentTotalTaxSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    totalShippingPriceSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    shippingLine {\n      discountAllocations {\n        allocatedAmountSet {\n          presentmentMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    currentTotalPriceSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    totalRefundedSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment OrderItem on Order {\n    id\n    name\n    legacyResourceId\n    createdAt\n    processedAt\n    updatedAt\n    cancelReason\n    cancelledAt\n    displayFulfillmentStatus\n    returnStatus\n    displayFinancialStatus\n    email\n    phone\n    lineItems(first: 250) {\n      nodes {\n        ...OrderLineItem\n      }\n    }\n    shippingAddress {\n      formatted\n      name\n    }\n    fulfillments {\n      trackingInfo {\n        company\n        number\n        url\n      }\n    }\n    currentSubtotalPriceSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    currentTotalTaxSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    totalShippingPriceSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    shippingLine {\n      discountAllocations {\n        allocatedAmountSet {\n          presentmentMoney {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n    currentTotalPriceSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n    totalRefundedSet {\n      presentmentMoney {\n        amount\n        currencyCode\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CustomerDelete($input: CustomerDeleteInput!) {\n    customerDelete(input: $input) {\n      deletedCustomerId\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CustomerDelete($input: CustomerDeleteInput!) {\n    customerDelete(input: $input) {\n      deletedCustomerId\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CustomerCreate($input: CustomerInput!) {\n    customerCreate(input: $input) {\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CustomerCreate($input: CustomerInput!) {\n    customerCreate(input: $input) {\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CustomerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {\n    customerEmailMarketingConsentUpdate(input: $input) {\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CustomerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {\n    customerEmailMarketingConsentUpdate(input: $input) {\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {\n    metafieldsSet(metafields: $metafields) {\n      metafields {\n        value\n        key\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {\n    metafieldsSet(metafields: $metafields) {\n      metafields {\n        value\n        key\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RequestReturnMutation($input: ReturnRequestInput!) {\n    returnRequest(input: $input) {\n      return {\n        id\n        status\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RequestReturnMutation($input: ReturnRequestInput!) {\n    returnRequest(input: $input) {\n      return {\n        id\n        status\n      }\n      userErrors {\n        field\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCustomerByEmail($email: String!) {\n    customers(first: 1, query: $email) {\n      nodes {\n        id\n        email\n        numberOfOrders\n        emailMarketingConsent {\n          marketingState\n          marketingOptInLevel\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCustomerByEmail($email: String!) {\n    customers(first: 1, query: $email) {\n      nodes {\n        id\n        email\n        numberOfOrders\n        emailMarketingConsent {\n          marketingState\n          marketingOptInLevel\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetReturnableFulfillments($orderId: ID!) {\n    returnableFulfillments(orderId: $orderId, first: 150) {\n      nodes {\n        returnableFulfillmentLineItems(first: 150) {\n          nodes {\n            quantity\n            fulfillmentLineItem {\n              id\n              originalTotalSet {\n                presentmentMoney {\n                  amount\n                  currencyCode\n                }\n              }\n              lineItem {\n                variantTitle\n                title\n                image {\n                  url\n                  altText\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetReturnableFulfillments($orderId: ID!) {\n    returnableFulfillments(orderId: $orderId, first: 150) {\n      nodes {\n        returnableFulfillmentLineItems(first: 150) {\n          nodes {\n            quantity\n            fulfillmentLineItem {\n              id\n              originalTotalSet {\n                presentmentMoney {\n                  amount\n                  currencyCode\n                }\n              }\n              lineItem {\n                variantTitle\n                title\n                image {\n                  url\n                  altText\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCustomerOrders(\n    $first: Int = 250\n    $after: String\n    $query: String\n    $sortKey: OrderSortKeys\n    $reverse: Boolean\n  ) {\n    orders(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      nodes {\n        ...OrderItem\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCustomerOrders(\n    $first: Int = 250\n    $after: String\n    $query: String\n    $sortKey: OrderSortKeys\n    $reverse: Boolean\n  ) {\n    orders(first: $first, after: $after, query: $query, sortKey: $sortKey, reverse: $reverse) {\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n      nodes {\n        ...OrderItem\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;