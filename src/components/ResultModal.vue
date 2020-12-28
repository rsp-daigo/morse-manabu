<template>
  <div>
    <div class="modal" v-show="isOpen" @click="close">
      <div class="modal__holder">
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
    /**
     * モーダルオープン
     */
    open: function(currentQuestion) {
      console.log(currentQuestion);
      this.morseText = currentQuestion.value.morseText;
      this.morseImg = `res-${currentQuestion.key}.jpg`;

      this.isOpen = true;
    },

    /**
     * モーダルオープン
     */
    close: function() {
      this.$emit('onResultModalClose');
      this.isOpen = false;
    },
  },
};
</script>
