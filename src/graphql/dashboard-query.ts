import { gql } from "@apollo/client";

// All module cards and the timeline share this exact event scope. Piscines are separate.
export const GET_DASHBOARD = gql`
  query LearningDashboard($modulePath: String!, $modulePattern: String!) {
    user {
      id
      login
      email
      attrs
      auditRatio
      totalUp
      totalDown
      validAudits: audits_aggregate(where: { grade: { _gte: 1 } }, order_by: { createdAt: desc }) {
        nodes {
          group {
            captainLogin
            createdAt
          }
        }
      }
      failedAudits: audits_aggregate(where: { grade: { _lt: 1 } }, order_by: { createdAt: desc }) {
        nodes {
          group {
            captainLogin
            createdAt
          }
        }
      }
    }
    moduleXP: transaction_aggregate(
      where: { type: { _eq: "xp" }, event: { path: { _eq: $modulePath } } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
    projectXP: transaction_aggregate(
      where: {
        type: { _eq: "xp" }
        event: { path: { _eq: $modulePath } }
        object: { type: { _eq: "project" } }
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
    exerciseXP: transaction_aggregate(
      where: {
        type: { _eq: "xp" }
        event: { path: { _eq: $modulePath } }
        object: { type: { _eq: "exercise" } }
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
    piscineGoXP: transaction_aggregate(
      where: { type: { _eq: "xp" }, path: { _like: "%bh-piscine%" } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
    piscineJsXP: transaction_aggregate(
      where: { type: { _eq: "xp" }, path: { _like: "%piscine-js%" } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
    currentLevel: transaction(
      order_by: { amount: desc }
      limit: 1
      where: { type: { _eq: "level" }, path: { _like: $modulePattern } }
    ) {
      amount
    }
    transactions: transaction(
      where: { type: { _eq: "xp" }, event: { path: { _eq: $modulePath } } }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      object {
        name
        type
      }
    }
    skillTransactions: transaction(where: { type: { _like: "skill_%" } }) {
      type
      amount
    }
    progress(where: { object: { type: { _eq: "project" } } }) {
      grade
      object {
        name
      }
    }
  }
`;
export const MODULE_PATH = process.env.NEXT_PUBLIC_MODULE_PATH || "/bahrain/bh-module";
