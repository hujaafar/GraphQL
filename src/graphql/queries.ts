import { gql } from "@apollo/client";

// Fetch basic user information
export const GET_USER_INFO = gql`
  query GetUserInfo {
  user {
    id
    login
    email
    attrs 
  }
}
`;
// Fetch all transactions for XP breakdown
export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transaction(
      where: {
        type: { _eq: "xp" }
        _or: [
          { object: { type: { _eq: "project" } } }
          {
            object: { type: { _eq: "exercise" } }
            event: { path: { _eq: "/bahrain/bh-module" } }
          }
        ]
      }
      order_by: { createdAt: asc }
    ) {
      amount
      createdAt
      object {
        name
        type
      }
    }
  }
`;

// Fetch the total XP
export const GET_TOTAL_XP = gql`
  query GetTotalXP {
    transaction_aggregate(
      where: {
        event: { path: { _eq: "/bahrain/bh-module" } }
        type: { _eq: "xp" }
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`;

export const GET_LEVEL_PROGRESS = gql`
  query GetLevelProgress {
    currentLevel: transaction(
      order_by: { amount: desc }
      limit: 1
      where: { type: { _eq: "level" }, path: { _like: "/bahrain/bh-module%" } }
    ) {
      amount
    }
    totalXP: transaction_aggregate(
      where: {
        type: { _eq: "xp" }
        event: { path: { _eq: "/bahrain/bh-module" } }
      }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
   ` ;

// Fetch top transaction (highest XP gain)
export const GET_TOP_TRANSACTION = gql`
  query GetTopTransaction {
    transaction(
      order_by: { amount: desc }
      limit: 1
      where: { type: { _eq: "level" }, path: { _like: "/bahrain/bh-module%" } }
    ) {
      amount
    }
  }
`;

// Fetch audit stats
export const GET_AUDIT_STATS = gql`
  query GetAuditStats {
    user {
      auditRatio
      totalUp
      totalDown
    }
  }
`;

// Fetch valid and failed audits
export const GET_AUDITS = gql`
  query GetAudits {
    user {
      validAudits: audits_aggregate(
        where: { grade: { _gte: 1 } }
        order_by: { createdAt: desc }
      ) {
        nodes {
          group {
            captainLogin
            createdAt
          }
        }
      }
      failedAudits: audits_aggregate(
        where: { grade: { _lt: 1 } }
        order_by: { createdAt: desc }
      ) {
        nodes {
          group {
            captainLogin
            createdAt
          }
        }
      }
    }
  }
`;

// Fetch XP breakdown by projects and exercises
export const GET_XP_BREAKDOWN = gql`
  query GetXPBreakdown {
    transaction(
      where: { type: { _eq: "xp" } }
      order_by: { createdAt: asc }
    ) {
      amount
      object {
        type
        name
      }
    }
  }
`;

// Fetch user progress (project grades)
export const GET_PROJECT_PROGRESS = gql`
  query GetProjectProgress {
    progress(where: { object: { type: { _eq: "project" } } }) {
      grade
      object {
        name
      }
    }
  }
`;

// Get Total XP and Breakdown
export const GET_TOTAL_AND_BREAKDOWN_XP = gql`
  query GetTotalAndBreakdownXP {
    totalXP: transaction_aggregate(
      where: {
        type: { _eq: "xp" }
        event: { path: { _eq: "/bahrain/bh-module" } }
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
    projectXP: transaction_aggregate(
      where: { type: { _eq: "xp" }, object: { type: { _eq: "project" } } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
    exerciseXP: transaction_aggregate(
      where: { type: { _eq: "xp" }, object: { type: { _eq: "exercise" } } }
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
  }
`;


export const GET_SKILL_TRANSACTIONS = gql`
  query GetSkillTransactions {
    skillTransactions: transaction(
      where: {
        _and: [
          { type: { _neq: "xp" } }
          { type: { _neq: "up" } }
          { type: { _neq: "down" } }
          { type: { _neq: "level" } }
        ]
      }
    ) {
      type
      amount
    }
  }
`;


export const GET_PROJECT_TRANSACTIONS = gql`
  query GetProjectTransactions {
    transaction(
      where: {
        type: { _eq: "xp" }
        object: { type: { _eq: "project" } }
      }
      order_by: { createdAt: asc }
    ) {
      amount
      object {
        type
        name
      }
      createdAt
    }
  }
`;
