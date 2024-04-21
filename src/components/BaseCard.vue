<template>
  <section class="card_container">
    <div class="card">
      <h2>{{ title }}</h2>
      <p>{{ content }}</p>
      <p v-for="comment in comments">{{ comment.content }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
type Props = {
  id: string;
  title: string;
  content: string;
  comments: Array;
};

const { title, content } = defineProps<Props>();
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid #ccc; /* 경계선 스타일 */
  border-radius: 8px; /* 경계선 둥글게 */
  padding: 16px; /* 내부 여백 */
  margin: 10px; /* 외부 여백 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
}

h2 {
  color: #333; /* 제목 색상 */
  margin-bottom: 10px; /* 제목과 내용 사이 여백 */
}

p {
  color: #666; /* 내용 색상 */
  font-size: 14px; /* 글자 크기 */
  line-height: 1.5; /* 줄간격 */
}
.card_container {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
</style>
