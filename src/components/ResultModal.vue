<template>
  <div>
    <div
      class="el-modal"
      :aria-hidden="isOpen ? 'false' : 'true'"
      @click="close"
    >
      <div class="el-modal__holder">
        <h2>不正解</h2>
        <hr />
        <div class="morse_text_box">
          <span>{{ morseText }}</span>
          <br />
          <img :src="require(`@/assets/image/${morseImg}`)" />
        </div>
        <div class="morse_image_box">
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  data: function() {
    return {
      isOpen: false,
      morseText: '',
      morseImg: 'res-A.jpg',
    };
  },
  methods: {
    open: function(currentQuestion) {
      console.log(currentQuestion);
      this.morseText = currentQuestion.value.morseText;
      this.morseImg = `res-${currentQuestion.key}.jpg`;

      this.isOpen = true;
    },
    close: function() {
      this.isOpen = false;
    },
  },
};
</script>
