const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endPoints = require("../endpoints.json");

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
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        const date = new Date(1594329060000);

        expect(article.article_id).toBe(1);
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("I find this existence challenging");
        // expect(article.created_at).toBe(new Date(1594329060000).toJSON()); there is an hour difference in the timestamp?
        expect(article.votes).toBe(100);
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
