<template>
  <div class="avatar" :title="title">
    {{ initials }}
  </div>
</template>

<script>
export default {
  name: "AvatarName",
  props: {
    name: { type: String, default: "" },   // alias or email
  },
  computed: {
    title() {
      return this.name || "User";
    },
    initials() {
      const n = (this.name || "").trim();
      if (!n) return "U";
      // if it's an email, take first char before @ and first char after (if any)
      if (n.includes("@")) {
        const [left, domain] = n.split("@");
        const a = left?.[0] || "";
        const b = domain?.[0] || "";
        return (a + b).toUpperCase();
      }
      // otherwise split by space and take first letters
      const parts = n.split(/\s+/).filter(Boolean);
      if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
      return (parts[0][0] + parts[1][0]).toUpperCase();
    },
  },
};
</script>

<style scoped>
.avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #1f2937; /* gray-800 */
  color: #fff;
  font-weight: 700;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}
</style>
