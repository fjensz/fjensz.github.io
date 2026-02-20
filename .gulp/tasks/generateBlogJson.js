import gulp from 'gulp';
import fm from 'front-matter';
import fs from 'fs';
import path from 'path';

export function generateBlogJson(done) {
  const blogDir = 'src/pages/blog';
  const outputFile = 'src/data/blog-posts.json';
  
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  const posts = files.map(filename => {
    const content = fm(fs.readFileSync(path.join(blogDir, filename), 'utf8'));
    const attrs = content.attributes;
    const body = content.body;
    
    const lines = body.trim().split('\n');
    let firstParagraph = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('#')) continue;
      firstParagraph += (firstParagraph ? '\n' : '') + trimmed;
      if (trimmed !== '') break;
    }
    
    return {
      title: attrs.title || '',
      date: attrs.date || '',
      slug: attrs.slug || '',
      year: attrs.year || '',
      category: attrs.category || '',
      content: firstParagraph.trim()
    };
  });
  
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
  
  console.log(`Generated ${outputFile} with ${posts.length} posts`);
  done();
}
