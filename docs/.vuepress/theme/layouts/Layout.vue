<template>
  <div class="post-container">
    
    <article class="post">
      <h1 class="post-title">{{$page.title}}</h1>
      <Content />
    </article>

    <nav>
      <ol>
        <li v-for="(header, i) in titles" 
          :key="i"
          :class="[titleClass[header.level], i===activeIndex?'active':''].join(' ')"
        >
          <a :href="'#' + header.slug" class='sidebar-link'>{{header.title}}</a>
        </li>
      </ol>
    </nav>

  </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {

  data() {
    return {
      titleClass: ['level-1', 'level-2', 'level-3'],
      activeIndex: 0
    }
  },

  computed: {
    titles() {
      console.log(this.$page.headers)
      return this.$page.headers;
    }
  },
  

  methods: {
    onScroll: debounce(function() {
      this.setActiveHash();
    }, 300),

    setActiveHash() {
      const sidebarLinks = Array.from(document.querySelectorAll('.sidebar-link'));
      const anchors = Array.from(document.querySelectorAll('.header-anchor'))
        .filter(anchor => sidebarLinks.some(sidebarLink => sidebarLink.hash === anchor.hash));
      
       const scrollTop = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      )

       const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      )

      const bottomY = window.innerHeight + scrollTop

      for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i]
        const nextAnchor = anchors[i + 1]

        const isActive = i === 0 && scrollTop === 0
          || (scrollTop >= anchor.parentElement.offsetTop + 10
            && (!nextAnchor || scrollTop < nextAnchor.parentElement.offsetTop - 10))

        const routeHash = decodeURIComponent(this.$route.hash)
        if (isActive && routeHash !== decodeURIComponent(anchor.hash)) {
          const activeAnchor = anchor;

          this.activeIndex = i;
          // check if anchor is at the bottom of the page to keep $route.hash consistent
          if (bottomY === scrollHeight) {
            for (let j = i + 1; j < anchors.length; j++) {
              if (routeHash === decodeURIComponent(anchors[j].hash)) {
                return
              }
            }
          }
          this.$vuepress.$set('disableScrollBehavior', true)
          this.$router.replace(decodeURIComponent(activeAnchor.hash), () => {
            // execute after scrollBehavior handler.
            this.$nextTick(() => {
              this.$vuepress.$set('disableScrollBehavior', false)
            })
          })
          return
        }
      }
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onScroll)
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  }
}
</script>

<style lang="scss" scoped>
  @import "../styles/avenir-white.scss";

  .post-container {
    padding:1em;
    margin:auto;
    max-width:76vw;
    background:#fefefe;
    padding-bottom: 4rem;
    min-height: 100vh;
    display: flex;

    scroll-behavior: smooth;

    nav {
      position: sticky;
      top: 2rem;
      align-self: start;

      padding-left: 0;
      border-left: 1px solid #efefef;

      li {
        text-decoration: none;
        display: block;
        padding: .125rem 0;
        transition: all 50ms ease-in-out; 

        a {
          color: #000;
        }
      }

      li.active a {
        color: #b8945a;
        font-weight: 500;
      }

      li.level-2 {
        text-indent: 0em
      }

      li.level-3 {
        text-indent: 2em
      }
    }
    
    .post-title {
      color: #b8945a;
      margin-bottom: 1rem;
      border-bottom: 2px solid #e2cc9f;
    }
  }
</style>