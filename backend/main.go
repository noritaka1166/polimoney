package main

import (
	"log"
	"os"
	"time"

	"github.com/digitaldemocracy2030/polimoney/config"
	"github.com/digitaldemocracy2030/polimoney/controllers"
	"github.com/digitaldemocracy2030/polimoney/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// サーバー起動時刻を日本時間（JST）で保存
	jst, _ := time.LoadLocation("Asia/Tokyo")
	startTime := time.Now().In(jst).Format("2006-01-02 15:04:05")

	// データベース接続を確立
	db, err := config.ConnectDB()
	if err != nil {
		log.Fatalf("データベース接続エラー: %v", err)
	}

	// GORM接続のクリーンアップ
	defer func() {
		sqlDB, err := db.DB()
		if err != nil {
			log.Printf("データベース接続の取得に失敗: %v", err)
			return
		}
		sqlDB.Close()
	}()

	// Ginルーターを作成
	r := gin.Default()

	// ミドルウェアを設定
	r.Use(middleware.CORS())                 // CORSミドルウェアを追加
	r.Use(middleware.RequestID())            // Request IDミドルウェアを追加
	r.Use(middleware.DatabaseMiddleware(db)) // データベース接続ミドルウェアを追加
	r.Use(middleware.ErrorHandler())         // エラーハンドリングミドルウェアを追加

	// コントローラー初期化
	userController := controllers.NewUserController(db)
	healthController := controllers.NewHealthController(db)

	// エンドポイントを設定
	// ルートハンドラー (開発用)
	r.GET("/", func(c *gin.Context) {
		c.String(200, "Welcome to the API - Started at "+startTime)
	})

	// API v1 グループ
	v1 := r.Group("/api/v1")
	{
		// ヘルスチェック controllers/health.go
		v1.GET("/health", healthController.HealthCheck)

		// 以下、管理者用
		admin := v1.Group("/admin")
		{
			// ユーザー関連の controllers/user.go
			users := admin.Group("/users")
			{
				users.GET("", userController.GetAllUsers)     // 全ユーザー取得
				users.GET("/:id", userController.GetUserByID) // 特定ユーザー取得
			}
		}
	}

	// サーバーを起動
	log.Printf("Server starting on port %s at %s", port, startTime)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("サーバー起動エラー: %v", err)
	}
}
