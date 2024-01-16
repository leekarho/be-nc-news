const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endPoints = require("../endpoints.json");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("GET:200 returns topics with correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  test("returns an object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe("object");
      });
  });
  test("endPoints has correct keys", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const respEndpoints = response.body;
        expect(respEndpoints).toEqual(endPoints);

        delete respEndpoints["GET /api"];
        for (keys in respEndpoints) {
          expect(respEndpoints[keys].hasOwnProperty("description")).toBe(true);
          expect(respEndpoints[keys].hasOwnProperty("queries")).toBe(true);
          expect(respEndpoints[keys].hasOwnProperty("exampleResponse")).toBe(
            true
          );
        }
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET: 200 sends a single article", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;

        expect(article.article_id).toBe(3);
        expect(article.title).toBe("Eight pug gifs that remind me of mitch");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(article.body).toBe("some gifs");
        expect(article.created_at).toBe(new Date(1604394720000).toJSON());
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET:404 sends error message when given a non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("GET:400 sends error message when given a bad request", () => {
    return request(app)
      .get("/api/articles/pokemon")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("return an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.article;
        expect(articles.length).toBe(13);

        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("should be sorted by article.created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.article;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 get all comments from article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET:400 sends error message when given a bad request", () => {
    return request(app)
      .get("/api/articles/pokemon/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("GET:404 sends error message when given a non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("GET:200 responds with empty array if article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toEqual([]);
      });
  });
  test("GET:200 array of comments is in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("can add a comment to an article", () => {
    const newComment = {
      username: "butter_bridge",
      body: "i bloody love coding",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("i bloody love coding");
      });
  });
  test("POST 400: sends error message when given a non-existent id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "i bloody love coding",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
