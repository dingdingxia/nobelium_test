import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import BLOG from '@/blog.config'
import mediumZoom from 'medium-zoom'


const Page = ({ postsToShow, page, showNext }) => {
  return (
    <Container>
      {postsToShow &&
        postsToShow.map(post => <BlogPost key={post.id} post={post} />)}
      <Pagination page={page} showNext={showNext} />
    </Container>
  )
}

export async function getStaticProps (context) {
  const images = Array.from(document.querySelectorAll(".notion-asset-wrapper img"));
    if ($(window).width() >= 991) {
      images.forEach(img => {
        mediumZoom(img, {
          margin: 0, /* The space outside the zoomed image */
          background: "#fff", /* The background of the overlay */
          scrollOffset: 40, /* The number of pixels to scroll to close the zoom */
          container: null, /* The viewport to render the zoom in */
          template: null /* The template element to display on zoom */
        });
      });
    }
  const { page } = context.params // Get Current Page No.
  const posts = await getAllPosts({ includePages: false })
  const postsToShow = posts.slice(
    BLOG.postsPerPage * (page - 1),
    BLOG.postsPerPage * page
  )
  const totalPosts = posts.length
  const showNext = page * BLOG.postsPerPage < totalPosts
  return {
    props: {
      page, // Current Page
      postsToShow,
      showNext
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: false })
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / BLOG.postsPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export default Page
