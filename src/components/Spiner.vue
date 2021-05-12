<template  >
  <div class="spring-spinner">
    <div class="spring-spinner-part top">
      <div class="spring-spinner-rotator"></div>
    </div>
    <div class="spring-spinner-part bottom">
      <div class="spring-spinner-rotator"></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
.spring-spinner,
.spring-spinner * {
  box-sizing: border-box;
}

.spring-spinner {
  height: 30px;
  width: 30px;
}
.spring-spinner.spinner-chart {
  height: 100px;
  width: 100px;
  position: relative;
  top: 50%;
  left: 50%;
}

.spring-spinner .spring-spinner-part {
  overflow: hidden;
  height: calc(30px / 2);
  width: 30px;
}
.spring-spinner.spinner-chart .spring-spinner-part {
  height: calc(100px / 2);
  width: 100px;
}

.spring-spinner .spring-spinner-part.bottom {
  transform: rotate(180deg) scale(-1, 1);
}

.spring-spinner .spring-spinner-rotator {
  width: 30px;
  height: 30px;
  border: calc(30px / 7) solid transparent;
  border-right-color: #fff;
  border-top-color: #fff;
  border-radius: 50%;
  box-sizing: border-box;
  animation: spring-spinner-animation 3s ease-in-out infinite;
  transform: rotate(-200deg);
}
.spring-spinner.spinner-chart .spring-spinner-rotator {
  width: 100px;
  height: 100px;
  border: calc(100px / 7) solid transparent;
  border-right-color: #191a20;
  border-top-color: #191a20;
}

@keyframes spring-spinner-animation {
  0% {
    border-width: calc(30px / 7);
  }
  25% {
    border-width: calc(30px / 23.33);
  }
  50% {
    transform: rotate(115deg);
    border-width: calc(30px / 7);
  }
  75% {
    border-width: calc(30px / 23.33);
  }
  100% {
    border-width: calc(30px / 7);
  }
}
</style>