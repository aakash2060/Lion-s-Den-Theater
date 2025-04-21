using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP25.P03.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedFoodItemsOnCart : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Carts_CartId",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_FoodCartItem_Carts_CartId",
                table: "FoodCartItem");

            migrationBuilder.DropForeignKey(
                name: "FK_FoodCartItem_FoodItems_FoodItemId",
                table: "FoodCartItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodCartItem",
                table: "FoodCartItem");

            migrationBuilder.RenameTable(
                name: "FoodCartItem",
                newName: "FoodCartItems");

            migrationBuilder.RenameIndex(
                name: "IX_FoodCartItem_FoodItemId",
                table: "FoodCartItems",
                newName: "IX_FoodCartItems_FoodItemId");

            migrationBuilder.RenameIndex(
                name: "IX_FoodCartItem_CartId",
                table: "FoodCartItems",
                newName: "IX_FoodCartItems_CartId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodCartItems",
                table: "FoodCartItems",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Carts_CartId",
                table: "CartItems",
                column: "CartId",
                principalTable: "Carts",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FoodCartItems_Carts_CartId",
                table: "FoodCartItems",
                column: "CartId",
                principalTable: "Carts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FoodCartItems_FoodItems_FoodItemId",
                table: "FoodCartItems",
                column: "FoodItemId",
                principalTable: "FoodItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CartItems_Carts_CartId",
                table: "CartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_FoodCartItems_Carts_CartId",
                table: "FoodCartItems");

            migrationBuilder.DropForeignKey(
                name: "FK_FoodCartItems_FoodItems_FoodItemId",
                table: "FoodCartItems");

            migrationBuilder.DropPrimaryKey(
                name: "PK_FoodCartItems",
                table: "FoodCartItems");

            migrationBuilder.RenameTable(
                name: "FoodCartItems",
                newName: "FoodCartItem");

            migrationBuilder.RenameIndex(
                name: "IX_FoodCartItems_FoodItemId",
                table: "FoodCartItem",
                newName: "IX_FoodCartItem_FoodItemId");

            migrationBuilder.RenameIndex(
                name: "IX_FoodCartItems_CartId",
                table: "FoodCartItem",
                newName: "IX_FoodCartItem_CartId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_FoodCartItem",
                table: "FoodCartItem",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CartItems_Carts_CartId",
                table: "CartItems",
                column: "CartId",
                principalTable: "Carts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FoodCartItem_Carts_CartId",
                table: "FoodCartItem",
                column: "CartId",
                principalTable: "Carts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FoodCartItem_FoodItems_FoodItemId",
                table: "FoodCartItem",
                column: "FoodItemId",
                principalTable: "FoodItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
