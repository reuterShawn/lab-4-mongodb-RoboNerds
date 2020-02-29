package umm3601;

import java.util.Arrays;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import io.javalin.Javalin;

import umm3601.user.UserController;
import umm3601.todo.TodoController;

public class Server {

  static String appName = "UMM CSci 3601 Lab 4";

  public static final String USER_DATA_FILE = "/users.json";
  public static final String TODO_DATA_FILE = "/todos.json";
  private static MongoDatabase database;
  private static MongoDatabase todoDatabase;

  public static void main(String[] args) {

    // Get the MongoDB address and database name from environment variables and
    // if they aren't set, use the defaults of "localhost" and "dev".
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");
    String databaseName = System.getenv().getOrDefault("MONGO_DB", "dev");

    // Setup the MongoDB client object with the information we set earlier
    MongoClient mongoClient = MongoClients.create(
      MongoClientSettings.builder()
      .applyToClusterSettings(builder ->
        builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
      .build());

    // Get the database
    database = mongoClient.getDatabase(databaseName);
    todoDatabase = mongoClient.getDatabase(databaseName);

    // Initialize dependencies
    UserController userController = new UserController(database);
    TodoController todoController = new TodoController(todoDatabase);

    //UserRequestHandler userRequestHandler = new UserRequestHandler(userController);
    //TodoRequestHandler todoRequestHandler = new TodoRequestHandler(todoController);

    Javalin server = Javalin.create().start(4567);

    // Simple example route
    server.get("hello", ctx -> ctx.result("Hello World"));

    // Utility routes
    server.get("api", ctx -> ctx.result(appName));

    // Get specific user or todo
    server.get("api/users/:id", userController::getUser);
    server.get("api/todos/:id", todoController::getTodo);

    // Delete specific user or todo
    server.delete("api/users/:id", userController::deleteUser);
    server.delete("api/todos/:id", todoController::deleteTodo);

    // List users, or todos filtered using query parameters
    server.get("api/users", userController::getUsers);
    server.get("api/todos", todoController::getTodos);

    // Add new user or todo
    server.post("api/users/new", userController::addNewUser);
    server.post("api/todos/new", todoController::addNewTodo);





    server.exception(Exception.class, (e, ctx) -> {
      ctx.status(500);
      ctx.json(e); // you probably want to remove this in production
    });
  }
}
