import gulp from 'gulp';
import fm from 'front-matter';
import { marked } from 'marked';
import through2 from 'through2';
import fs from 'fs';

export function blogPosts(PATHS) {
  return gulp.src('src/pages/blog/*.md')
    .pipe(through2.obj(function(file, enc, cb) {
      if (file.isNull()) {
        cb(null, file);
        return;
      }

      const content = fm(file.contents.toString());
      const attrs = content.attributes;
      const body = marked(content.body);

      const layoutPath = attrs.layout === 'blog-post' ? 'src/layouts/blog-post.html' : 'src/layouts/default.html';
      let layout = fs.readFileSync(layoutPath, 'utf8');

      const root = '../';

      let renderedBody = body;
      if (attrs.layout === 'blog-post') {
        const sidebar = fs.readFileSync('src/partials/sidebar_nav.html', 'utf8')
          .replace(/{{root}}/g, root);
        renderedBody = layout
          .replace(/{{!--[\s\S]*?--}}/g, '')
          .replace('{{> sidebar_nav}}', sidebar)
          .replace('{{> body}}', body)
          .replace(/{{root}}/g, root);
      } else {
        renderedBody = layout
          .replace(/{{!--[\s\S]*?--}}/g, '')
          .replace('{{> body}}', body)
          .replace(/{{root}}/g, root);
      }

      layout = fs.readFileSync('src/layouts/default.html', 'utf8');
      layout = layout
        .replace(/{{!--[\s\S]*?--}}/g, '')
        .replace('{{> body}}', renderedBody)
        .replace(/{{root}}/g, root);

      if (attrs.title) {
        layout = layout.replace('<title>Foundation for Sites</title>', `<title>${attrs.title}</title>`);
      }

      file.contents = Buffer.from(layout);
      file.basename = file.basename.replace(/\.md$/, '.html');
      this.push(file);
      cb();
    }))
    .pipe(gulp.dest(PATHS.dist + '/blog'));
}
