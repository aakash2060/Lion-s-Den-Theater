using Microsoft.AspNetCore.Mvc;
using Selu383.SP25.P03.Api.Features.Payment;
using Stripe.Checkout;

[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public PaymentsController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost("create-checkout-session")]
    public async Task<ActionResult> CreateCheckoutSession([FromBody] CreateCheckoutSessionRequest request)
    {
        var options = new SessionCreateOptions
        {
            PaymentMethodTypes = new List<string> { "card" },
            LineItems = request.Services.Select(service => new SessionLineItemOptions
            {
                PriceData = new SessionLineItemPriceDataOptions
                {
                    Currency = "usd",
                    ProductData = new SessionLineItemPriceDataProductDataOptions
                    {
                        Name = service.Name,
                    },
                    UnitAmount = service.Price ,
                },
                Quantity = 1,
            }).ToList(),
            Mode = "payment",
            SuccessUrl = $"{Request.Scheme}://{Request.Host}/thankyou",
            CancelUrl = $"{Request.Scheme}://{Request.Host}/cancel",
        };

        var service = new SessionService();
        var session = await service.CreateAsync(options);

        return Ok(new { sessionId = session.Id });
    }

    [HttpGet("public-key")]
    public IActionResult GetPublicKey()
    {
        var publicKey = _configuration["Stripe:PublishableKey"];
        return Ok(new { publicKey });
    }

}