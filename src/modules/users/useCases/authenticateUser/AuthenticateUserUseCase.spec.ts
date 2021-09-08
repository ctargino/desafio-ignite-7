import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should autheticate user", async () => {
    const password = "test";
    const email = "email";

    await createUserUseCase.execute({
      email,
      name: "test",
      password,
    });

    const auth = await authenticateUserUseCase.execute({
      email,
      password,
    });

    expect(auth).toHaveProperty("token");
  });

  it("Should throw an error if not find user", async () => {
    const password = "test";
    const email = "email";

    await createUserUseCase.execute({
      email,
      name: "test",
      password,
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "email_not_exist",
        password,
      });
    }).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });

  it("Should throw an error if password not match", async () => {
    const password = "test";
    const email = "email";

    await createUserUseCase.execute({
      email,
      name: "test",
      password,
    });

    expect(async () => {
      await authenticateUserUseCase.execute({
        email,
        password: "incorrect_password",
      });
    }).rejects.toEqual(new IncorrectEmailOrPasswordError());
  });
});
