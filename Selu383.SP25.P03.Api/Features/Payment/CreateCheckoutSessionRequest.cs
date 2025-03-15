namespace Selu383.SP25.P03.Api.Features.Payment
{
    public class CreateCheckoutSessionRequest
    {
        public List<ServiceItem> Services { get; set; }

    }

    public class ServiceItem
    {
        public string Name { get; set; }
        public int Price { get; set; }
    }
}
