using System.Net;
using System.Net.Sockets;
using System.Text;

namespace Client;

internal class Message
{
    public string? text { get; set; }
    public DateTime date { get; } = DateTime.Now;

    public Message(string text)
    {
        this.text = text;
    }

    public override string ToString()
    {
        return $"[{date.ToString("HH:mm")}]\t{text}";
    }
}

internal class Chat
{
    private List<Message> messageHistory { get; } = new List<Message>();

    // Синхронизация истории чата
    public void Fetch()
    {
        messageHistory.Sort((a, b) => a.date.CompareTo(b.date));
        Console.Clear();
        foreach (var message in messageHistory)
        {

            if (message.text.Split(':')[0].Equals("You"))
            {
                Console.ForegroundColor = ConsoleColor.Green;
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
            }

            if (message.text.Equals("Собеседник отключился. Чат закрыт."))
            {
                Console.ForegroundColor = ConsoleColor.Red;
            }

            Console.WriteLine(message.ToString());
            Console.ResetColor();
        }
    }

    public void NewMessage(Message message)
    {
        if (message.text.Split(": ")[1].Equals("/exit"))
        {
            message.text = "Собеседник отключился. Чат закрыт.";
        }

        messageHistory.Add(message);
        Fetch();
    }
}

class Program
{
    private static async Task Main()
    {
        var localAddress = IPAddress.Parse("127.0.0.1");
        string message = "";
        var chat = new Chat();

        Console.Write("Введите имя пользователя: ");
        var username = Console.ReadLine();
        if (string.IsNullOrWhiteSpace(username)) return;

        Console.Write("Введите порт получателя(ваш): ");
        if (!int.TryParse(Console.ReadLine(), out var recieverPort)) return;

        Console.Write("Введите порт приёмщика: ");
        if (!int.TryParse(Console.ReadLine(), out var senderPort)) return;
        Console.Clear();

        // TCP подключение
        var serverEp = new IPEndPoint(localAddress, recieverPort);
        using Socket listener = new(
            AddressFamily.InterNetwork,
            SocketType.Stream,
            ProtocolType.Tcp);

        listener.Bind(serverEp);
        listener.Listen(100);
        await ConnectToChat();

        // UDP чат
        Task.Run(ReceiveMessageAsync);
        await SendMessageAsync();

        // Отправка сообщений
        async Task ConnectToChat()
        {
            Console.WriteLine("Ожидание подключения...");

            while (true)
            {
                var clientEp = new IPEndPoint(localAddress, senderPort);

                try
                {
                    using Socket client = new(
                        AddressFamily.InterNetwork,
                        SocketType.Stream,
                        ProtocolType.Tcp);

                    await client.ConnectAsync(clientEp);

                    Console.Clear();
                    break;
                }
                catch
                {
                    // ignored
                }
            }
        }

        async Task SendMessageAsync()
        {
            using var sender = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);

            while (true)
            {
                message = "";
                Console.Write(">Введите сообщение: ");
                
                ConsoleKeyInfo cki = Console.ReadKey();
                while (cki.Key != ConsoleKey.Enter)
                {
                    if (cki.Key == ConsoleKey.Backspace)
                    {
                        if (!message.Equals(""))
                        {
                            message = message[..^1];
                        }
                        chat.Fetch();
                        Console.Write($">Введите сообщение: {message}");

                        cki = Console.ReadKey();
                        continue;
                    }
                    message += cki.KeyChar;
                    cki = Console.ReadKey();
                }

                if (string.IsNullOrWhiteSpace(message))
                {
                    chat.Fetch();
                    continue;
                }

                chat.NewMessage(new Message("You: " + message));

                byte[] data = Encoding.UTF8.GetBytes($"{username}: {message}");
                await sender.SendToAsync(data, SocketFlags.None, new IPEndPoint(localAddress, senderPort));

                if (message.Equals("/exit"))
                {
                    sender.Close();
                    break;
                }
            }
        }

        // Прием сообщений
        async Task ReceiveMessageAsync()
        {
            var data = new byte[65535];
            using var receiver = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp);
            receiver.Bind(new IPEndPoint(localAddress, recieverPort));

            while (true)
            {
                var result =
                    await receiver.ReceiveFromAsync(data, SocketFlags.None, new IPEndPoint(localAddress, senderPort));
                var newMessage = Encoding.UTF8.GetString(data, 0, result.ReceivedBytes);
                
                chat.NewMessage(new Message(newMessage));

                if (newMessage.Equals("/exit"))
                {
                    Environment.Exit(0);
                    receiver.Close();
                    break;
                }


                Console.Write($">Введите сообщение: {message}");
            }
        }
    }
}