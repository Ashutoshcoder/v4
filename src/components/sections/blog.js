import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { IconExternal, IconFolder } from '@components/icons';
import styled from 'styled-components';
import { theme, mixins, media, Section, Heading } from '@styles';
const { colors, fontSizes, fonts } = theme;

const BlogContainer = styled(Section)`
  ${mixins.flexCenter};
  flex-direction: column;
  align-items: stretch;
`;
// const BlogTitle = styled.h4`
//   margin: 0 auto 50px;
//   font-size: ${fontSizes.h3};
//   ${media.tablet`font-size: 24px;`};
//   a {
//     display: block;
//   }
// `;
const BlogGrid = styled.div`
  .blogs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-gap: 15px;
    position: relative;
    ${media.tablet`grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));`};
  }
`;
const BlogInner = styled.div`
  ${mixins.boxShadow};
  ${mixins.flexBetween};
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  padding: 2rem 1.75rem;
  height: 100%;
  border-radius: ${theme.borderRadius};
  transition: ${theme.transition};
  background-color: ${colors.lightNavy};
`;
const Article = styled.div`
  transition: ${theme.transition};
  cursor: default;
  &:hover,
  &:focus {
    outline: 0;
    ${BlogInner} {
      transform: translateY(-5px);
    }
  }
`;
const BlogHeader = styled.div`
  ${mixins.flexBetween};
  margin-bottom: 30px;
`;
const Folder = styled.div`
  color: ${colors.green};
  svg {
    width: 40px;
    height: 40px;
  }
`;
const Links = styled.div`
  margin-right: -10px;
  color: ${colors.lightSlate};
`;
const IconLink = styled.a`
  position: relative;
  top: -10px;
  padding: 10px;
  svg {
    width: 24px;
    height: 24px;
  }
`;
const BlogName = styled.h5`
  margin: 0 0 10px;
  font-size: ${fontSizes.xxlarge};
  color: ${colors.lightestSlate};
`;
const BlogDescription = styled.div`
  font-size: 17px;
  a {
    ${mixins.inlineLink};
  }
`;
const ReadMore = styled.a`
  ${mixins.bigButton};
  margin: auto;
  margin-top: 50px;
  width: 20vw;
  text-align: center;
  ${media.thone`width: 50vw;`};
  ${media.tablet`width: 40vw;`};
`;
const StyledTechList = styled.ul`
  display: flex;
  align-items: flex-end;
  flex-grow: 1;
  flex-wrap: wrap;
  padding: 0;
  margin: 20px 0 0 0;
  list-style: none;

  li {
    font-family: ${fonts.SFMono};
    font-size: ${fontSizes.xs};
    color: ${colors.slate};
    line-height: 1.75;
    margin-right: 15px;
    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const Blog = ({ data }) => {
  // const [showMore, setShowMore] = useState(false);
  const revealContainer = useRef(null);
  const revealArticles = useRef([]);
  useEffect(() => {
    sr.reveal(revealContainer.current, srConfig());
    revealArticles.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 2;
  const blog = data.filter(({ node }) => node.frontmatter.show === 'true');
  // const firstSix = blog.slice(0, GRID_LIMIT);
  // const blogsToShow = showMore ? blog : firstSix;
  // console.log(data);

  return (
    <BlogContainer id="blog" ref={revealContainer}>
      <Heading>Recent Articles</Heading>
      <BlogGrid>
        <TransitionGroup className="blogs">
          {blog &&
            blog.map(({ node }, i) => {
              const { frontmatter, html } = node;
              const { title, tags, url } = frontmatter;
              return (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <Article
                    key={i}
                    ref={el => (revealArticles.current[i] = el)}
                    tabIndex="0"
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    <BlogInner>
                      <header>
                        <BlogHeader>
                          <Folder>
                            <IconFolder />
                          </Folder>
                          <Links>
                            {url && (
                              <IconLink
                                href={url}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                aria-label="External Link">
                                <IconExternal />
                              </IconLink>
                            )}
                          </Links>
                        </BlogHeader>
                        <BlogName>{title}</BlogName>
                        <BlogDescription dangerouslySetInnerHTML={{ __html: html }} />
                      </header>
                      <footer>
                        <StyledTechList>
                          {tags.map((tag, i) => (
                            <li key={i}>{tag}</li>
                          ))}
                        </StyledTechList>
                      </footer>
                    </BlogInner>
                  </Article>
                </CSSTransition>
              );
            })}
        </TransitionGroup>
      </BlogGrid>
      {/* <ShowMoreButton onClick={() => setShowMore(!showMore)}>
        {showMore ? 'Fewer' : 'More'} Projects
      </ShowMoreButton> */}
      <ReadMore
        href={`https://medium.com/@ashutoshkumardbms`}
        target="_blank"
        rel="nofollow noopener noreferrer">
        Read More
      </ReadMore>
    </BlogContainer>
  );
};

Blog.propTypes = {
  data: PropTypes.array.isRequired,
};

export default Blog;
