<template>
  <h3>GraphQL DEMO</h3>
  <h4>전체 게시글 조회</h4>
  <p v-if="error">Something went wrong...</p>
  <p v-if="loading">Loading...</p>

  <!-- 카드 컴포넌트로 게시글 렌더링 -->
  <div v-else-if="result && result.viewAllPost" class="card-wrapper">
    <BaseCard
      v-for="post in result.viewAllPost"
      :key="post.id"
      :title="post.title"
      :content="post.content"
      :id="post.id"
      :comments="post.comments"
    >
    </BaseCard>
  </div>

  <h3>게시글 저장</h3>
  <form @submit.prevent="handleSavePost">
    <input v-model="newPostTitle" placeholder="게시글 제목 입력" />
    <input v-model="newPostContent" placeholder="게시글 내용 입력" />
    <button type="submit">게시글 저장</button>
  </form>

  <h3>댓글 저장</h3>
  <form @submit.prevent="handleSaveComment">
    <input
      v-model="postId"
      placeholder="댓글을 달 게시글의 ID 입력"
      type="number"
    />
    <input v-model="comment" placeholder="댓글 내용 입력" />
    <button type="submit">댓글 저장</button>
  </form>

  <div v-if="viewCommentError">Something went wrong...</div>
  <div v-if="viewCommentLoading">Loading...</div>
  <div v-else-if="viewPostResult && viewPostResult.viewPost">
    <h4>{{ viewPostResult.viewPost.title }}</h4>
    <p>{{ viewPostResult.viewPost.content }}</p>
    <h5>Author: {{ viewPostResult.viewPost.author.name }}</h5>
    <ul>
      <li v-for="comment in viewPostResult.viewPost.comments" :key="comment.id">
        {{ comment.content }} - by {{ comment.writer.name }}
      </li>
    </ul>
  </div>

  <!-- 특정 게시글 조회 -->
  <h4>특정 게시글 조회</h4>
  <input
    v-model="viewPostId"
    placeholder="조회할 게시글의 ID 입력"
    type="number"
  />
  <button @click="handleViewPost">게시글 조회</button>
  <div v-if="viewPostLoading">Loading...</div>
  <div v-if="viewPostError">Something went wrong: {{ viewPostError }}</div>
  <div v-else-if="viewPostResult">
    <h4>{{ viewPostResult.title }}</h4>
    <p>{{ viewPostResult.content }}</p>
    <h5>Author: {{ viewPostResult.author.name }}</h5>
    <ul>
      <li v-for="comment in viewPostResult.comments" :key="comment.id">
        {{ comment.content }} - by {{ comment.writer.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import gql from "graphql-tag";
import BaseCard from "./BaseCard.vue";
import {
  SAVE_POST_MUTATION,
  GET_POSTS_QUERY,
  VIEW_POST_MUTATION,
} from "../query/post";
import { SAVE_COMMENT_MUTATION } from "../query/comment";

//캐시옵션
const options = ref({
  fetchPolicy: "cache-first",
});

//전체 게시글 조회 타입 정의
interface QueryResult {
  viewAllPost: Post[];
}

//게시글 타입 정의
interface Post {
  id: number;
  title: string;
  content: string;
  comments: Comment[];
}
//댓글 타입 정의
interface Comment {
  content: string;
}

//게시글 작성 시 Input
const newPostTitle = ref("");
const newPostContent = ref("");

//댓글 작성 시 Input
const postId = ref("");
const comment = ref("");

// 특정 게시글 조회 상태
const viewPostId = ref("");
const viewPostResult = ref(null);
const viewPostError = ref(null);
const viewPostLoading = ref(false);

const { result, loading, error, networkStatus } = useQuery<QueryResult>(
  GET_POSTS_QUERY,
  null,
  options
);

//특정 게시글 조회 useMutation
const { mutate: viewPost } = useMutation(VIEW_POST_MUTATION, {
  onCompleted(data) {
    viewPostResult.value = data.viewPost;
  },
  onError(error) {
    viewPostError.value = error.message;
  },
});

//뮤테이션 사용 설정 부분
const { mutate: savePost } = useMutation(SAVE_POST_MUTATION);
const { mutate: saveComment, loading: viewCommentLoading } = useMutation(
  SAVE_COMMENT_MUTATION
);

//게시글 작성 함수
function handleSavePost() {
  const request = {
    title: newPostTitle.value,
    content: newPostContent.value,
  };
  savePost({
    request,
  })
    .then(({ data }) => {
      console.log("Post saved:", data);
      newPostTitle.value = "";
      newPostContent.value = "";
      alert("게시글이 저장되었습니다.");
    })
    .catch((error) => {
      console.error("Error saving post:", error);
      alert("게시글 저장에 실패했습니다.");
    });
}

//댓글 작성 함수
function handleSaveComment() {
  // 뮤테이션 실행
  saveComment({
    postId: postId.value,
    request: {
      content: comment.value,
    },
  })
    .then(({ data }) => {
      console.log("Comment saved:", data);
      comment.value = ""; // 댓글 내용 초기화
      alert("댓글이 저장되었습니다.");
    })
    .catch((error) => {
      console.error("Error saving comment:", error);
      alert("댓글 저장에 실패했습니다.");
    });
}

// 특정 게시글 조회 실행 함수
function handleViewPost() {
  viewPostLoading.value = true;
  viewPost({ postId: viewPostId.value })
    .then((response) => {
      viewPostResult.value = { ...response.data.viewPost };
      console.log(viewPostResult.value);
      viewPostLoading.value = false;
    })
    .catch(() => {
      viewPostLoading.value = false;
    });
}
</script>

<style scoped>
.card-wrapper {
  display: flex;
}
</style>
