import { createServer, Model, hasMany, belongsTo, RestSerializer } from "miragejs"

export default function server () {
  createServer({
    models: {
      post: Model.extend({
        comments: hasMany(),
        user: belongsTo(),
      }),

      comment: Model.extend({
        post: belongsTo(),
        user: belongsTo(),
      }),

      user: Model.extend({
        posts: hasMany(),
        comments: hasMany(),
      }),
    },

    serializers: {
      post: RestSerializer.extend({
        include: ["user", "comments"],
        embed: true,
      }),
      comment: RestSerializer.extend({
        include: ["user"],
        embed: true,
      }),
    },

    seeds(server) {
      const pedrita = server.create('user', { name: 'Pedrita' })
      const mosty = server.create('user', { name: 'Mosty' })

      const pedritaPost1 = server.create("post", { user: pedrita, title: "Getting lost in the forest 101" });
      const pedritaPost2 = server.create("post", { user: pedrita, title: "Why I hate hypnos... And my dad" });
      server.create("comment", { user: mosty, post: pedritaPost1, body: 'You suck, kid. 1v1 me.' });
      server.create("comment", { user: mosty, post: pedritaPost2, body: 'You suck, kid. 1v1 me.' });

      const mostyPost1 = server.create("post", { user: mosty, title: "Water pokemon are the best!" });
      const mostyPost2 = server.create("post", { user: mosty, title: "How I lost my bike to a kid without teeth" });
      server.create("comment", { user: pedrita, post: mostyPost1, body: 'I live in a boring island' });
      server.create("comment", { user: mosty, post: mostyPost2, body: 'I comment in my own post because I am awesome!' });
    },

    routes() {
      this.resource('users', { path: '/api/users'})
      this.resource('posts', { path: '/api/posts'})
      this.resource('comments', { path: '/api/comments'})
    },
  })
}
