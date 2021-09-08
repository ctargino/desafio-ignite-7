import { CreateUserUseCase } from "./CreateUserUseCase";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should create a user", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@t.com",
      name: "test",
      password: "test",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a existent user", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "teste@t.com",
        name: "test",
        password: "test",
      });

      await createUserUseCase.execute({
        email: "teste@t.com",
        name: "test",
        password: "test",
      });
    }).rejects.toEqual(new CreateUserError());
  });
});
