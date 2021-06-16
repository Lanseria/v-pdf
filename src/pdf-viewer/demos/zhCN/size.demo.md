# 尺寸

```html
<n-space>
  <n-tag closable size="small" @close="handleClose"> 爱在西元前 </n-tag>
  <n-tag type="warning" closable @close="handleClose"> 超人不会飞 </n-tag>
  <n-tag type="info" closable size="large" @close="handleClose">
    哪里都是你
  </n-tag>
</n-space>
```

```js
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {
      handleClose() {
        console.info("tag close");
      }
    };
  }
});
```
