import gql from "graphql-tag";
import { useMutation } from "@vue/apollo-composable";

//전체 게시글 조회 쿼리

export const GET_POSTS_QUERY = gql`
  query {
    viewAllPost {
      id
      title
      content
      comments {
        content
      }
    }
  }
`;

//게시글 저장 뮤테이션
export const SAVE_POST_MUTATION = gql`
  mutation SavePost($request: RequestPost!) {
    savePost(request: $request) {
      id
      title
      content
      views
      author {
        id
        name
      }
      comments {
        id
        content
      }
    }
  }
`;

const { mutate: savePost } = useMutation(SAVE_POST_MUTATION);

// 특정 게시글 조회 뮤테이션
export const VIEW_POST_MUTATION = gql`
  mutation ViewPost($postId: ID!) {
    viewPost(postId: $postId) {
      id
      title
      content
      views
      author {
        id
        name
      }
      comments {
        id
        content
        writer {
          id
          name
        }
      }
    }
  }
`;
