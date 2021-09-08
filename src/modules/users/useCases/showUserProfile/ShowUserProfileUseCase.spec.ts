import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should show user profile", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@t.com",
      name: "test",
      password: "test",
    });

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile.id).toEqual(user.id);
  });

  it("Should throw an error if user not exists", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("user_not_exists");
    }).rejects.toEqual(new ShowUserProfileError());
  });
});
