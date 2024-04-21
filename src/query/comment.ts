import gql from "graphql-tag";

//댓글 저장 쿼리
export const SAVE_COMMENT_MUTATION = gql`
  mutation SaveComment($postId: ID!, $request: RequestComment!) {
    saveComment(postId: $postId, request: $request) {
      id
      content
    }
  }
`;
