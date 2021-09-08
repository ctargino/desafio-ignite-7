import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "@modules/users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "@modules/statements/entities/Statement";
import { CreateStatementError } from "./CreateStatementError";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should Create a new deposit statement", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@t.com",
      name: "test",
      password: "test",
    });

    const deposit = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 90,
      description: "deposit test",
      type: OperationType.DEPOSIT,
    });

    expect(deposit).toHaveProperty("id");
  });

  it("Should Create a new withdraw statement", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@t.com",
      name: "test",
      password: "test",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 90,
      description: "deposit test",
      type: OperationType.DEPOSIT,
    });

    const withdraw = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 30,
      description: "withdraw test",
      type: OperationType.WITHDRAW,
    });

    expect(withdraw).toHaveProperty("id");
  });

  it("Should throw an error if user not exist", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: "user_not_exist",
        amount: 90,
        description: "deposit test",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toEqual(new CreateStatementError.UserNotFound());
  });

  it("Should throw an error if balance less than withdraw amount ", async () => {
    const user = await createUserUseCase.execute({
      email: "teste@t.com",
      name: "test",
      password: "test",
    });

    await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 10,
      description: "deposit test",
      type: OperationType.DEPOSIT,
    });

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 30,
        description: "withdraw test",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toEqual(new CreateStatementError.InsufficientFunds());
  });
});
