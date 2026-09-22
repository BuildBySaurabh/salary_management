import {describe,expect,it} from "vitest";
describe("ACME Salary Manager",()=>{it("loads the application module",async()=>{const app=await import("./App.jsx");expect(app.default).toBeTypeOf("function");});});
